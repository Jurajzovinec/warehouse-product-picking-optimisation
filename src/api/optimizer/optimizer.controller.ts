import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { OptimizerService } from './optimizer.service';
import { GetOptimizedInput } from './dto/optimizer-input.dto';

@ApiTags('Optimizer')
@Controller('optimizer')
export class OptimizerController {
  public constructor(private readonly optimizerService: OptimizerService) {}

  @Get()
  @ApiQuery({
    name: 'xPosition',
    required: true,
    description: 'Initial position of worker on x-axis',
    type: Number
  })
  @ApiQuery({
    name: 'yPosition',
    required: true,
    description: 'Initial position of worker on y-axis',
    type: Number
  })
  @ApiQuery({
    name: 'zPosition',
    required: true,
    description: 'Initial position of worker on z-axis',
    type: Number
  })
  @ApiQuery({
    name: 'productsNumbers',
    required: true,
    description: 'Comma separated list of products numbers to be picked',
    type: String
  })
  public getPositions(@Query(new ValidationPipe({ transform: true })) input: GetOptimizedInput) {
    return this.optimizerService.getPositions(input);
  }
}
