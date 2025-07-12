import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ClientProvider } from '@show-republic/config';
import { AppController } from './app.controller';
import { UploadfileService } from './services/uploadfile.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [UploadfileService, S3ClientProvider],
})
export class AppModule {}
