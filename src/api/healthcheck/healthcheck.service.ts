import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  public getHealth(): string {
    return 'OK';
  }
}
