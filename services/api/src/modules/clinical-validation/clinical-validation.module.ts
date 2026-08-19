import { Module } from '@nestjs/common';

import { ClinicalValidationService } from './clinical-validation.service';

@Module({
  providers: [ClinicalValidationService],
  exports: [ClinicalValidationService],
})
export class ClinicalValidationModule {}