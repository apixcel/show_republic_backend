import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UploadfileService } from './services/uploadfile.service';

@Controller()
export class AppController {
  constructor(private readonly uploadfileService: UploadfileService) {}

  @MessagePattern({ cmd: 'uploadFile' })
  upload(file: Express.Multer.File) {
    return this.uploadfileService.upload(file);
  }
}
