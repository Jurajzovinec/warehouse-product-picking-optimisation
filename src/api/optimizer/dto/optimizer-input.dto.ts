import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { Utils } from '../../../shared/utils';

export class GetOptimizedInput {
  @IsInt({ message: 'xPos must be an integer' })
  @Min(0, { message: 'xPos must be greater than or equal to 0' })
  @Max(200, { message: 'xPos must be less than or equal to 200' })
  @Type(() => Number)
  public readonly xPosition: number;

  @IsInt({ message: 'yPos must be an integer' })
  @Min(0, { message: 'yPos must be greater than or equal to 0' })
  @Max(200, { message: 'yPos must be less than or equal to 200' })
  @Type(() => Number)
  public readonly yPosition: number;

  @IsInt({ message: 'zPos must be an integer' })
  @Min(0, { message: 'yPos must be greater than or equal to 0' })
  @Max(200, { message: 'yPos must be less than or equal to 200' })
  @Type(() => Number)
  public readonly zPosition: number;

  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'number' && Number.isInteger(value)) {
      return [value];
    }
    if (typeof value !== 'string') {
      throw new BadRequestException(`Unexpected type for productsNumbers: ${typeof value}`);
    }
    return Utils.getUniqueArray(value.split(',').map((v) => parseInt(v)));
  })
  public readonly productsNumbers: number[];
}
