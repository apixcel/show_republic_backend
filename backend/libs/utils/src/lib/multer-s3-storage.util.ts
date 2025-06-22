import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@show-republic/config'; // Adjust the import path as necessary
import { Request } from 'express';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid'; // Ensure this package is installed

/**
 * Multer S3 storage configuration.
 */
export const multerS3Storage = multerS3({
  s3: s3Client,
  bucket: 'showrepublic',
  metadata: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, metadata?: any) => void,
  ) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, key?: string) => void,
  ) => {
    // Determine folder based on the request URL
    let folder = 'default';
    if (req.originalUrl.includes('edit_profile')) {
      folder = 'User';
    } else if (req.originalUrl.includes('create_post')) {
      folder = 'posts';
    }

    // Generate a unique file name using UUID
    const uniqueFileName = `${folder}/-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

export const deleteImageFromS3 = async (key: string): Promise<void> => {
  try {
    const deleteParams = {
      Bucket: 'showrepublic', // Your S3 bucket name
      Key: key, // The S3 key of the image to delete
    };

    // Create the DeleteObjectCommand with the parameters
    const command = new DeleteObjectCommand(deleteParams);

    // Execute the command with the s3Client
    await s3Client.send(command);

    console.log(`Image deleted successfully: ${key}`);
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw new Error('Failed to delete image from S3.');
  }
};
