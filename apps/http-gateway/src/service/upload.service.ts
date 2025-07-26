// // uploadfile.service.ts
// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import { Inject, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { randomUUID } from 'crypto';

// @Injectable()
// export class UploadfileService {
//   constructor(
//     @Inject('S3_CLIENT') private readonly s3Client: S3Client,
//     private readonly configService: ConfigService,
//   ) {}

//   async upload(file: Express.Multer.File): Promise<string> {
//     const bucket = this.configService.get<string>('AWS_BUCKET_NAME');
//     const region = this.configService.get<string>('AWS_REGION');
//     const key = `${Date.now()}-${randomUUID()}-${file.originalname}`;

//     await this.s3Client.send(
//       new PutObjectCommand({
//         Bucket: bucket,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read',
//       }),
//     );

//     return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
//   }
// }
