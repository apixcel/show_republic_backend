import { errorConstants } from '@show-republic/utils';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

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

export class SendAdminInvitationDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails!: string[];
}
