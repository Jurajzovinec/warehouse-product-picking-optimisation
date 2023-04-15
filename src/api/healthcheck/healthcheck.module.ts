import { Module } from '@nestjs/common';
import { HealthCheckService } from './HealthCheck.service';
import { HealthCheckController } from './HealthCheck.controller';

@Module({
  controllers: [HealthCheckController],
  providers: [HealthCheckService]
})
export class HealthCheckModule {}
