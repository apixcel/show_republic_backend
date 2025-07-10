import { CloudinaryStorage } from 'multer-storage-cloudinary';
// cloudinary.provider.ts
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
// cloudinary-storage.ts

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'nestjs_uploads',
      resource_type: 'auto', // handles image, video, raw
      format: file.mimetype.split('/')[1], // optional: force format
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// cloudinary-storage.ts
