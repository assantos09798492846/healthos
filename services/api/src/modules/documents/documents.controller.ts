import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

import { ClinicalDocumentType } from '../../generated/prisma/client';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@ApiTags('Documents')
@Controller('patients/:patientId/documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Importar PDF clínico do paciente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type', 'title'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: Object.values(ClinicalDocumentType),
        },
        title: {
          type: 'string',
          example: 'Exames laboratoriais - Julho 2026',
        },
        documentDate: {
          type: 'string',
          format: 'date',
          example: '2026-07-31',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          callback(
            new BadRequestException(
              'Nesta etapa somente arquivos PDF são permitidos.',
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  upload(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'O arquivo PDF é obrigatório.',
      );
    }

    return this.documentsService.upload(
      patientId,
      dto,
      file,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar documentos do paciente' })
  findAll(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.documentsService.findAllByPatient(patientId);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Consultar metadados do documento' })
  findOne(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.documentsService.findOne(
      patientId,
      documentId,
    );
  }

  @Get(':documentId/file')
  @ApiOperation({ summary: 'Visualizar PDF original' })
  async getFile(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Res() response: Response,
  ) {
    const { document, buffer } =
      await this.documentsService.getFile(
        patientId,
        documentId,
      );

    response.setHeader(
      'Content-Type',
      document.mimeType,
    );

    response.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodeURIComponent(
        document.originalName,
      )}`,
    );

    response.send(buffer);
  }
}
