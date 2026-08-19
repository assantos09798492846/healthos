import { Injectable } from '@nestjs/common';

@Injectable()
export class ClinicalIntelligenceService {

  async generateSummary(patientId: string) {

    return {
      patientId,

      totalResults: 0,

      normal: 0,

      altered: 0,

      critical: 0,
    };

  }

}