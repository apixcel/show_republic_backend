import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { errorConstants } from '@show-republic/utils';


export enum AdminStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
}

export class AdminDto {
  @IsNotEmpty({ message: errorConstants.FIELD_REQUIRED })
  firstName!: string;

  @IsNotEmpty({ message: errorConstants.FIELD_REQUIRED })
  lastName!: string;

  @IsNotEmpty({ message: errorConstants.FIELD_REQUIRED })
  phone!: string;

  @IsNotEmpty({ message: errorConstants.FIELD_REQUIRED })
  role!: string;

  @IsNotEmpty({ message: errorConstants.FIELD_REQUIRED })
  image!: string;

  @IsString()
  @IsNotEmpty({ message: errorConstants.FIELD_REQUIRED })
  username!: string;

  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: errorConstants.PASSWORD_FIELD_REQUIRED })
  password!: string;
}
