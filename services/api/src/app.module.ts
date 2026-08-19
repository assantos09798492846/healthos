import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';

import { DocumentsModule } from './modules/documents/documents.module';
import { DocumentProcessingModule } from './modules/document-processing/document-processing.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ClinicalParserModule } from './modules/clinical-parser/clinical-parser.module';
import { ClinicalIntelligenceModule } from './modules/clinical-intelligence/clinical-intelligence.module';

@Module({
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  PrismaModule,
  HealthModule,
  PatientsModule,
  MedicalRecordsModule,
  DocumentsModule,
  DocumentProcessingModule,
  ClinicalParserModule,
  ClinicalIntelligenceModule,
],
  controllers: [AppController],
})
export class AppModule {}