import { Module } from '@nestjs/common';
import { BoxPiModule } from '../providers/boxpi/boxpi.module';
import { HealthCheckModule } from '../api/HealthCheck/HealthCheck.module';
import { OptimizerModule } from '../api/optimizer/optimizer.module';
import { ConfigModule } from '@nestjs/config';
import boxpiConfig from '../config/boxpi.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [boxpiConfig],
      cache: true
    }),
    BoxPiModule,
    HealthCheckModule,
    OptimizerModule
  ]
})
export class AppModule {}
