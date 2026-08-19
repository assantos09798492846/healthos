export interface ParsedLabResult {
  testName: string;
  testCode?: string;
  category?: string;

  valueNumber?: number;
  valueText?: string;
  unit?: string;

  referenceLow?: number;
  referenceHigh?: number;
  referenceText?: string;

  interpretation?: string;

  sourceText: string;
}

export interface ClinicalParseResult {
  jobId: string;
  documentId: string;
  patientId: string;
  totalDetected: number;
  results: ParsedLabResult[];
}

export interface ClinicalPersistResult {
  jobId: string;
  documentId: string;
  patientId: string;
  detected: number;
  persisted: number;
}