export interface ExtractedDocument {
  text: string;
  pages: number;
}

export interface DocumentExtractor {
  extract(buffer: Buffer): Promise<ExtractedDocument>;
}