import { S3Client } from '@aws-sdk/client-s3';

// S3 configuration
export const s3Client = new S3Client({
  region:  'eu-north-1',
  credentials: {
    accessKeyId: 'AKIAQSOI4OYG63DXX5OR', // Replace with env vars
    secretAccessKey:  'KPHHLz6q78jvTNWqsKrv+dS3E7vZnNM0yCtSK2Wg', // Replace with env vars
  },
});
