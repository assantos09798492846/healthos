import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

import { PrismaService } from '../../database/prisma.service';
import { PdfNativeExtractor } from './extractors/pdf-native.extractor';

@Injectable()
export class DocumentProcessingService {
  private readonly storageRoot = resolve(
    process.cwd(),
    'storage',
    'documents',
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfNativeExtractor: PdfNativeExtractor,
  ) {}

  async create(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: {
        id: documentId,
      },
      select: {
        id: true,
        patientId: true,
        title: true,
        originalName: true,
      },
    });

    if (!document) {
      throw new NotFoundException(
        'Documento não encontrado.',
      );
    }

    const runningJob =
      await this.prisma.documentProcessingJob.findFirst({
        where: {
          documentId,
          status: {
            in: [
              'QUEUED',
              'EXTRACTING_TEXT',
              'OCR',
              'PARSING',
              'VALIDATING',
              'REVIEW_REQUIRED',
            ],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (runningJob) {
      throw new ConflictException(
        'Já existe um processamento ativo para este documento.',
      );
    }

    return this.prisma.documentProcessingJob.create({
      data: {
        documentId,
        status: 'QUEUED',
        progress: 0,
        pagesProcessed: 0,
      },
      include: {
        document: {
          select: {
            id: true,
            patientId: true,
            title: true,
            originalName: true,
          },
        },
      },
    });
  }

  async run(jobId: string) {
    const job =
      await this.prisma.documentProcessingJob.findUnique({
        where: {
          id: jobId,
        },
        include: {
          document: true,
        },
      });

    if (!job) {
      throw new NotFoundException(
        'Processamento não encontrado.',
      );
    }

    if (job.status === 'COMPLETED') {
      throw new ConflictException(
        'Este processamento já foi concluído.',
      );
    }

    if (
      job.status !== 'QUEUED' &&
      job.status !== 'FAILED' &&
      job.status !== 'OCR'
    ) {
      throw new ConflictException(
        `O processamento não pode ser iniciado no status ${job.status}.`,
      );
    }

    const absolutePath = resolve(
      this.storageRoot,
      job.document.storageKey,
    );

    const allowedPrefix = `${this.storageRoot}${sep}`;

    if (!absolutePath.startsWith(allowedPrefix)) {
      throw new InternalServerErrorException(
        'Caminho do documento inválido.',
      );
    }

    await this.prisma.documentProcessingJob.update({
      where: {
        id: jobId,
      },
      data: {
        status: 'EXTRACTING_TEXT',
        progress: 10,
        startedAt: new Date(),
        finishedAt: null,
        errorMessage: null,
        extractedText: null,
        pagesProcessed: 0,
      },
    });

    try {
      const buffer = await readFile(absolutePath);

      const extracted =
        await this.pdfNativeExtractor.extract(buffer);

      const text = extracted.text.trim();
      const pages = extracted.pages;

      /*
       * Nesta primeira versão consideramos que um PDF
       * precisa de OCR quando a extração nativa retorna
       * menos de 50 caracteres úteis.
       */
      if (text.length < 50) {
        return this.prisma.documentProcessingJob.update({
          where: {
            id: jobId,
          },
          data: {
            status: 'OCR',
            method: 'NATIVE_TEXT',
            progress: 25,
            pagesTotal: pages,
            pagesProcessed: 0,
            extractedText: text || null,
            errorMessage: null,
          },
          include: {
            document: {
              select: {
                id: true,
                patientId: true,
                type: true,
                title: true,
                originalName: true,
                mimeType: true,
              },
            },
          },
        });
      }

      return this.prisma.documentProcessingJob.update({
        where: {
          id: jobId,
        },
        data: {
          status: 'COMPLETED',
          method: 'NATIVE_TEXT',
          progress: 100,
          pagesTotal: pages,
          pagesProcessed: pages,
          extractedText: text,
          errorMessage: null,
          finishedAt: new Date(),
        },
        include: {
          document: {
            select: {
              id: true,
              patientId: true,
              type: true,
              title: true,
              originalName: true,
              mimeType: true,
            },
          },
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido durante a extração do documento.';

      await this.prisma.documentProcessingJob.update({
        where: {
          id: jobId,
        },
        data: {
          status: 'FAILED',
          progress: 0,
          errorMessage: message,
          finishedAt: new Date(),
        },
      });

      throw new InternalServerErrorException(
        'Falha ao processar o documento.',
      );
    }
  }

  async findOne(jobId: string) {
    const job =
      await this.prisma.documentProcessingJob.findUnique({
        where: {
          id: jobId,
        },
        include: {
          document: {
            select: {
              id: true,
              patientId: true,
              type: true,
              title: true,
              originalName: true,
              mimeType: true,
            },
          },
        },
      });

    if (!job) {
      throw new NotFoundException(
        'Processamento não encontrado.',
      );
    }

    return job;
  }

  async findByDocument(documentId: string) {
    const document =
      await this.prisma.document.findUnique({
        where: {
          id: documentId,
        },
        select: {
          id: true,
        },
      });

    if (!document) {
      throw new NotFoundException(
        'Documento não encontrado.',
      );
    }

    return this.prisma.documentProcessingJob.findMany({
      where: {
        documentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}