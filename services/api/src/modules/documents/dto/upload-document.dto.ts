import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ClinicalDocumentType } from '../../../generated/prisma/client';

export class UploadDocumentDto {
  @ApiProperty({
    enum: ClinicalDocumentType,
    description: 'Tipo clínico do documento',
  })
  @IsEnum(ClinicalDocumentType)
  type!: ClinicalDocumentType;

  @ApiProperty({
    example: 'Exames laboratoriais - Julho 2026',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  title!: string;

  @ApiPropertyOptional({
    example: '2026-07-31',
    description: 'Data do documento/laudo no formato YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  documentDate?: string;
}
