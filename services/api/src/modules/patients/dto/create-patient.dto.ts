import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PatientSexAtBirth {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  INTERSEX = 'INTERSEX',
  NOT_INFORMED = 'NOT_INFORMED',
}

export class CreatePatientDto {
  @ApiProperty({
    example: 'Alexandre Silva dos Santos',
    description: 'Nome completo do paciente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName!: string;

  @ApiProperty({
    example: '1971-12-28',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  @IsDateString()
  birthDate!: string;

  @ApiProperty({
    enum: PatientSexAtBirth,
    example: PatientSexAtBirth.MALE,
  })
  @IsEnum(PatientSexAtBirth)
  sexAtBirth!: PatientSexAtBirth;

  @ApiPropertyOptional({
    example: '12345678901',
    description: 'CPF somente com 11 dígitos, sem pontos ou hífen',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'cpf deve possuir exatamente 11 dígitos numéricos',
  })
  cpf?: string;

  @ApiPropertyOptional({
    example: 'O+',
    description: 'Tipo sanguíneo',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(A|B|AB|O)[+-]$/, {
    message: 'bloodType deve ser A+, A-, B+, B-, AB+, AB-, O+ ou O-',
  })
  bloodType?: string;

  @ApiPropertyOptional({
    example: 170,
    description: 'Altura em centímetros',
    minimum: 30,
    maximum: 250,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(250)
  heightCm?: number;
}
