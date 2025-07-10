import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3ClientProvider = {
  provide: 'S3_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID') || 'AKIAQSOI4OYG63DXX5OR',
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY') || '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',
      },
    });
  },
  inject: [ConfigService],
};
