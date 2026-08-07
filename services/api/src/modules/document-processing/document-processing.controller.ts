import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DocumentProcessingService } from './document-processing.service';

@ApiTags('Document Processing')
@Controller()
export class DocumentProcessingController {
  constructor(
    private readonly service: DocumentProcessingService,
  ) {}

  @Post('documents/:documentId/process')
  @ApiOperation({
    summary: 'Criar processamento para um documento',
  })
  create(
    @Param('documentId', ParseUUIDPipe)
    documentId: string,
  ) {
    return this.service.create(documentId);
  }

  @Post('document-processing/:jobId/run')
  @ApiOperation({
    summary: 'Executar processamento de um documento',
  })
  run(
    @Param('jobId', ParseUUIDPipe)
    jobId: string,
  ) {
    return this.service.run(jobId);
  }

  @Get('document-processing/:jobId')
  @ApiOperation({
    summary: 'Consultar status de um processamento',
  })
  findOne(
    @Param('jobId', ParseUUIDPipe)
    jobId: string,
  ) {
    return this.service.findOne(jobId);
  }

  @Get('documents/:documentId/processing')
  @ApiOperation({
    summary: 'Listar processamentos de um documento',
  })
  findByDocument(
    @Param('documentId', ParseUUIDPipe)
    documentId: string,
  ) {
    return this.service.findByDocument(documentId);
  }
}