import { Module } from '@nestjs/common';
import { BoxPiService } from './boxpi.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 30_000,
      maxRedirects: 5
    })
  ],
  providers: [BoxPiService],
  exports: [BoxPiService]
})
export class BoxPiModule {}
