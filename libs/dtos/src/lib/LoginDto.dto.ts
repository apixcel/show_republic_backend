import { errorConstants } from '@show-republic/utils';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;

  @MinLength(6, { message: errorConstants.PASSWORD_MIN_LENGTH })
  @MaxLength(10, { message: errorConstants.PASSWORD_MAX_LENGTH })
  @IsString()
  @IsNotEmpty({ message: errorConstants.PASSWORD_FIELD_REQUIRED })
  password!: string;
}
