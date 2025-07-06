import { errorConstants } from '@show-republic/utils';
import { IsEmail, IsNotEmpty } from 'class-validator';
import e = require('express');

export class ForogotPasswordRequestDto {
  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: errorConstants.PASSWORD_FIELD_REQUIRED })
  password!: string;
  @IsNotEmpty({ message: 'Token is required' })
  token!: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword!: string;
  @IsNotEmpty({ message: 'New password is required' })
  newPassword!: string;
}
