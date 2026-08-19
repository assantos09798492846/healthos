export enum ValidationStatus {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  HIGH = 'HIGH',
  UNKNOWN = 'UNKNOWN',
}

export interface ValidationResult {
  status: ValidationStatus;

  interpretation?: string;

  referenceLow?: number;

  referenceHigh?: number;

  referenceText?: string;
}