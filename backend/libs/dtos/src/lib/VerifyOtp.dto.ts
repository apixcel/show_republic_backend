import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { errorConstants } from '@show-republic/utils';

export class VerifyOtpDto {

  @IsNotEmpty({ message: errorConstants.SECRET_REQUIRED })
  secret!: number;

  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;
}


export class resendOtpDto {

  @IsString({ message: errorConstants.FIRST_NAME_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.FIRST_NAME_FIELD_REQUIRED })
  @Length(2, 30, { message: errorConstants.FIRST_NAME_FIELD_LENGTH })
  firstName!: string;

  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;
}

