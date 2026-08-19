import { Module } from '@nestjs/common';

import { ClinicalIntelligenceService } from './clinical-intelligence.service';

@Module({

  providers: [ClinicalIntelligenceService],

  exports: [ClinicalIntelligenceService],

})

export class ClinicalIntelligenceModule {}