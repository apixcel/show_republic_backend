import { errorConstants } from '@show-republic/utils';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: errorConstants.SECRET_REQUIRED })
  secret!: number;

  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;
}

export class resendOtpDto {
  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;
}
