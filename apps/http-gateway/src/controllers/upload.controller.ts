// upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '@show-republic/config';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    return {
      message: 'File uploaded to Cloudinary successfully!',
      url: file.path, // file.path is Cloudinary URL
      public_id: file.filename,
    };
  }
}
