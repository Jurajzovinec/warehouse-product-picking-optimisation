import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './HealthCheck.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health check')
@Controller('health-check')
export class HealthCheckController {
  public constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  public getHealth(): string {
    return this.healthCheckService.getHealth();
  }
}
