import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import {
  mkdir,
  readFile,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

import { PrismaService } from '../../database/prisma.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class DocumentsService {
  private readonly storageRoot = join(
    process.cwd(),
    'storage',
    'documents',
  );

  constructor(private readonly prisma: PrismaService) {}

  private serializeDocument<T extends { fileSizeBytes: bigint }>(
    document: T,
  ) {
    return {
      ...document,
      fileSizeBytes: document.fileSizeBytes.toString(),
    };
  }

  async upload(
    patientId: string,
    dto: UploadDocumentDto,
    file: Express.Multer.File,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const sha256 = createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    const duplicate = await this.prisma.document.findFirst({
      where: {
        patientId,
        sha256,
      },
    });

    if (duplicate) {
      throw new ConflictException(
        'Este documento já foi importado para o paciente.',
      );
    }

    const extension =
      extname(file.originalname).toLowerCase() || '.pdf';

    const storageKey = join(
      patientId,
      `${randomUUID()}${extension}`,
    );

    const absolutePath = join(
      this.storageRoot,
      storageKey,
    );

    await mkdir(dirname(absolutePath), {
      recursive: true,
    });

    await writeFile(absolutePath, file.buffer);

    try {
      const document = await this.prisma.document.create({
        data: {
          patientId,
          type: dto.type,
          title: dto.title,
          originalName: file.originalname,
          mimeType: file.mimetype,
          storageKey,
          sha256,
          fileSizeBytes: BigInt(file.size),
          documentDate: dto.documentDate
            ? new Date(
                `${dto.documentDate}T00:00:00.000Z`,
              )
            : undefined,
        },
      });

      return this.serializeDocument(document);
    } catch (error) {
      await unlink(absolutePath).catch(() => undefined);
      throw error;
    }
  }

  async findAllByPatient(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const documents = await this.prisma.document.findMany({
      where: { patientId },
      orderBy: [
        { documentDate: 'desc' },
        { importedAt: 'desc' },
      ],
    });

    return documents.map((document) =>
      this.serializeDocument(document),
    );
  }

  async findOne(
    patientId: string,
    documentId: string,
  ) {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        patientId,
      },
    });

    if (!document) {
      throw new NotFoundException(
        'Documento não encontrado.',
      );
    }

    return this.serializeDocument(document);
  }

  async getFile(
    patientId: string,
    documentId: string,
  ) {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        patientId,
      },
    });

    if (!document) {
      throw new NotFoundException(
        'Documento não encontrado.',
      );
    }

    const absolutePath = join(
      this.storageRoot,
      document.storageKey,
    );

    const buffer = await readFile(absolutePath);

    return {
      document,
      buffer,
    };
  }
}