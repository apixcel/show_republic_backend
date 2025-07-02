import { Gender, MaritalStatus } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  isString,
  IsString,
  ValidateNested,
} from 'class-validator';

class EmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  relationship!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  address!: string;
}

class JobInfoDto {
  @IsString()
  position!: string;

  @IsString()
  workLocation!: string;

  @IsString()
  jobType!: string;

  @IsEmail()
  workEmail!: string;

  @IsString()
  salary!: string;
}

class DocumentDto {
  @IsString()
  type!: string;

  @IsString()
  name!: string;

  @IsString()
  url!: string;
}

export class AdminProfileDto {
  @IsString()
  fullName!: string;

  @IsString()
  username!: string;

  @IsDateString()
  birthDate!: Date;

  @IsEnum(Gender)
  gender!: Gender;

  @IsString()
  state!: string;

  @IsString()
  city!: string;

  @IsEnum(MaritalStatus)
  maritalStatus!: MaritalStatus;

  @IsString()
  nationality!: string;

  @IsString()
  timeZone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  address!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact!: EmergencyContactDto;

  @IsObject()
  @ValidateNested()
  @Type(() => JobInfoDto)
  jobInfo!: JobInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents!: DocumentDto[];

  @IsString()
  @IsNotEmpty({ message: errorConstants.PASSWORD_FIELD_REQUIRED })
  password!: string;

  // @IsString()
  // admin!: string; // this should match the related AdminEntity ID
}
