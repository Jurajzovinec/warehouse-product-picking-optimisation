import { Module } from '@nestjs/common';
import { OptimizerService } from './optimizer.service';
import { OptimizerController } from './optimizer.controller';
import { BoxPiModule } from '../../providers/boxpi/boxpi.module';

@Module({
  imports: [BoxPiModule],
  controllers: [OptimizerController],
  providers: [OptimizerService]
})
export class OptimizerModule {}
