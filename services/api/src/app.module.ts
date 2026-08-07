import { DocumentsModule } from './modules/documents/documents.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { PatientsModule } from './modules/patients/patients.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { HealthModule } from './health/health.module';

@Module({
  controllers: [AppController],
  imports: [DocumentsModule, MedicalRecordsModule, ConfigModule.forRoot({ isGlobal: true }), PrismaModule, PatientsModule, HealthModule],
})
export class AppModule {}
