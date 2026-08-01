import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService, HealthStatus } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar o estado da API' })
  @ApiOkResponse({
    description: 'API disponível.',
    schema: {
      example: {
        status: 'ok',
        service: 'healthos-api',
        version: '0.1.0',
        timestamp: '2026-07-31T23:30:00.000Z',
        uptimeSeconds: 10,
      },
    },
  })
  getStatus(): HealthStatus {
    return this.healthService.getStatus();
  }
}
