import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Accept only images
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return cb(
      new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  cb(null, true);
};
