import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneratePdfModule } from './generate-pdf/generate-pdf.module';

@Module({
  imports: [GeneratePdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
