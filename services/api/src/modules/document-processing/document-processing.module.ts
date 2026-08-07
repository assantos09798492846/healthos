import { Module } from '@nestjs/common';

import { DocumentProcessingController } from './document-processing.controller';
import { DocumentProcessingService } from './document-processing.service';
import { PdfNativeExtractor } from './extractors/pdf-native.extractor';

@Module({
  controllers: [DocumentProcessingController],
  providers: [
    DocumentProcessingService,
    PdfNativeExtractor,
  ],
  exports: [
    DocumentProcessingService,
    PdfNativeExtractor,
  ],
})
export class DocumentProcessingModule {}