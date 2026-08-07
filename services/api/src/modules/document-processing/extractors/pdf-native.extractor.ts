import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

import {
  DocumentExtractor,
  ExtractedDocument,
} from './extractor.interface';

@Injectable()
export class PdfNativeExtractor implements DocumentExtractor {
  async extract(buffer: Buffer): Promise<ExtractedDocument> {
    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result = await parser.getText();

      return {
        text: result.text ?? '',
        pages: result.total ?? 0,
      };
    } finally {
      await parser.destroy();
    }
  }
}