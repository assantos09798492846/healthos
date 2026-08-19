import { Injectable } from '@nestjs/common';

import {
  ValidationResult,
  ValidationStatus,
} from './clinical-validation.types';

@Injectable()
export class ClinicalValidationService {
  validate(
    value?: number,
    low?: number,
    high?: number,
    referenceText?: string,
  ): ValidationResult {
    if (value === undefined || value === null) {
      return {
        status: ValidationStatus.UNKNOWN,
        referenceText,
      };
    }

    if (low !== undefined && value < low) {
      return {
        status: ValidationStatus.LOW,
        referenceLow: low,
        referenceHigh: high,
        referenceText,
      };
    }

    if (high !== undefined && value > high) {
      return {
        status: ValidationStatus.HIGH,
        referenceLow: low,
        referenceHigh: high,
        referenceText,
      };
    }

    return {
      status: ValidationStatus.NORMAL,
      referenceLow: low,
      referenceHigh: high,
      referenceText,
    };
  }
}