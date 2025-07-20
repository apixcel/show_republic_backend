import { Gender } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength
} from 'class-validator';

export class UserDto {
  id!: string; // Optional field if you want to include it in the DTO

  @IsString({ message: errorConstants.FIRST_NAME_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.FIRST_NAME_FIELD_REQUIRED })
  @Length(2, 30, { message: errorConstants.FIRST_NAME_FIELD_LENGTH })
  firstName!: string;

  @IsString({ message: errorConstants.LAST_NAME_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.LAST_NAME_FIELD_REQUIRED })
  @Length(2, 30, { message: errorConstants.LAST_NAME_FIELD_LENGTH })
  lastName!: string;

  @IsString({ message: errorConstants.GENDER_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.GENDER_FIELD_REQUIRED })
  gender!: Gender;

  @IsEmail({}, { message: errorConstants.INVALID_EMAIL })
  @IsNotEmpty({ message: errorConstants.EMAIL_REQUIRED })
  email!: string;

  @IsString({ message: errorConstants.PASSWORD_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.PASSWORD_FIELD_REQUIRED })
  @MinLength(6, { message: errorConstants.PASSWORD_MIN_LENGTH })
  @MaxLength(10, { message: errorConstants.PASSWORD_MAX_LENGTH })
  password!: string;

  @IsString({ each: true, message: errorConstants.INTERESTS_FIELD_STRING })
  @IsArray({ message: errorConstants.INTERESTS_FIELD_ARRAY })
  // @ArrayMinSize(1, { message: errorConstants.INTERESTS_MIN_SIZE })
  @IsOptional()
  interests!: string[];
}

export class UpdateUserDto {
  @IsString({ message: errorConstants.FIRST_NAME_FIELD_STRING })
  @IsOptional()
  @Length(2, 30, { message: errorConstants.FIRST_NAME_FIELD_LENGTH })
  firstName!: string;

  @IsString({ message: errorConstants.LAST_NAME_FIELD_STRING })
  @IsOptional()
  @Length(2, 30, { message: errorConstants.LAST_NAME_FIELD_LENGTH })
  lastName!: string;

  @IsString({ message: errorConstants.USERNAME_FIELD_STRING })
  @IsOptional()
  userName?: string;

  @IsString({ message: errorConstants.COUNTRY_FIELD_STRING })
  @IsOptional()
  country?: string;

  @IsString({ message: errorConstants.BIO_FIELD_STRING })
  @IsOptional()
  bio?: string;

  @IsString({ message: errorConstants.WEBSITE_URL_FIELD_STRING })
  @IsOptional()
  websiteUrl?: string;

  @IsString({ message: errorConstants.CONTACT_NUMBER_FIELD_STRING })
  @IsOptional()
  contactNumber?: string;

  @IsString({ message: errorConstants.PROFILE_PICTURE_FIELD_STRING })
  @IsOptional()
  profilePicture?: string;

  @IsString({ message: errorConstants.COVER_PICTURE_FIELD_STRING })
  @IsOptional()
  coverPhoto?: string;
}


export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword!: string;
}