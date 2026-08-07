import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Identificar a API do HealthOS' })
  getRoot() {
    return {
      name: 'HealthOS API',
      status: 'online',
      version: '0.1.0',
      health: '/api/v1/health',
      documentation: '/docs',
    };
  }
}
