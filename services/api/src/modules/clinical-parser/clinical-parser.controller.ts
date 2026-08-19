import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ClinicalParserService } from './clinical-parser.service';

@ApiTags('Clinical Parser')
@Controller('clinical-parser')
export class ClinicalParserController {
  constructor(
    private readonly service: ClinicalParserService,
  ) {}

  @Get('health')
  @ApiOperation({
    summary:
      'Verificar o estado do Clinical Parser',
  })
  health() {
    return {
      module:
        'Clinical Parser',
      status: 'OK',
    };
  }

  @Get(
    'jobs/:jobId/preview',
  )
  @ApiOperation({
    summary:
      'Pré-visualizar resultados laboratoriais identificados',
  })
  preview(
    @Param(
      'jobId',
      ParseUUIDPipe,
    )
    jobId: string,
  ) {
    return this.service.preview(
      jobId,
    );
  }

  @Post(
    'jobs/:jobId/persist',
  )
  @ApiOperation({
    summary:
      'Persistir resultados laboratoriais identificados',
  })
  persist(
    @Param(
      'jobId',
      ParseUUIDPipe,
    )
    jobId: string,
  ) {
    return this.service.persist(
      jobId,
    );
  }
}