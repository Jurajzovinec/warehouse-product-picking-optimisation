import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BoxPiConfig } from '../../config/boxpi.config';
import { HttpService } from '@nestjs/axios';
import { BoxApiPositionRes } from './boxpi.types';

@Injectable()
export class BoxPiService {
  private readonly positionsUrl: string =
    'https://dev.aux.boxpi.com/case-study/products/{productId}/positions';

  private readonly apiKey: string;

  public constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiKey = this.config.get<BoxPiConfig>('boxPi').apiKey;
  }

  public async getPositions(productId: string) {
    const url = this.positionsUrl.replace('{productId}', productId);
    const { data } = await this.httpService.axiosRef.get<unknown>(url, {
      headers: { 'x-api-key': this.apiKey }
    });

    if (!this.isPositionResponse(data)) {
      throw new InternalServerErrorException('Invalid response from BoxPi API', data);
    }

    return data;
  }

  private isPositionResponse(data: unknown): data is BoxApiPositionRes {
    return (
      typeof data === 'object' &&
      data !== null &&
      Array.isArray(data) &&
      data.every(
        (item) =>
          'x' in item &&
          'y' in item &&
          'z' in item &&
          'positionId' in item &&
          'productId' in item &&
          'quantity' in item
      )
    );
  }
}
