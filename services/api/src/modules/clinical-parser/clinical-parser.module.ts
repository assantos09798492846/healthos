import { Module } from '@nestjs/common';

import { ClinicalParserController } from './clinical-parser.controller';
import { ClinicalParserService } from './clinical-parser.service';

@Module({
  controllers: [ClinicalParserController],
  providers: [ClinicalParserService],
  exports: [ClinicalParserService],
})
export class ClinicalParserModule {}