import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

import { PostType } from '@show-republic/types';
import { errorConstants } from '@show-republic/utils';

export enum YesNO {
  yes = 'yes',
  no = 'no',
}

export class CreatePostDto {
  @IsString()
  @IsOptional()
  userId!: string;

  @IsEnum(PostType, { message: errorConstants.INVALID_POST_TYPE })
  postType!: PostType;

  @IsString({ message: errorConstants.INVALID_CATEGORY })
  @IsOptional()
  category!: string;

  @IsEnum(YesNO, { message: 'audience must be yes or no' })
  @IsOptional()
  audience!: string;

  @IsEnum(YesNO, { message: 'ageRestriction must be yes or no' })
  @IsOptional()
  ageRestriction!: string;

  @Length(0, 100, { message: errorConstants.TITLE_LENGTH })
  @IsString({ message: errorConstants.INVALID_TITLE })
  title!: string;

  @IsUrl({}, { message: errorConstants.INVALID_VIDEO_URL })
  @IsNotEmpty({ message: errorConstants.VIDEO_URL_REQUIRED })
  videoUrl!: string;

  @Length(0, 1000, { message: errorConstants.DESCRIPTION_LENGTH })
  @IsString({ message: errorConstants.INVALID_DESCRIPTION })
  @IsOptional()
  description?: string;

  @IsOptional()
  playlist?: string;

  @IsArray({ message: errorConstants.INVALID_TAGS_ARRAY })
  @IsString({ each: true, message: errorConstants.INVALID_TAGS_STRING })
  @IsOptional()
  tags: string[] = [];

  @IsUrl({}, { message: errorConstants.INVALID_THUMBNAIL })
  @IsNotEmpty({ message: errorConstants.THUMBNAIL_REQUIRED })
  thumbnail!: string;
}

export class UpdatePostDto {
  @IsString({ message: errorConstants.INVALID_CATEGORY })
  @IsOptional()
  category?: string;

  @IsEnum(YesNO, { message: 'audience must be yes or no' })
  @IsOptional()
  audience?: string;

  @IsEnum(YesNO, { message: 'ageRestriction must be yes or no' })
  @IsOptional()
  ageRestriction?: string;

  @Length(0, 100, { message: errorConstants.TITLE_LENGTH })
  @IsString({ message: errorConstants.INVALID_TITLE })
  @IsOptional()
  title?: string;

  @Length(0, 1000, { message: errorConstants.DESCRIPTION_LENGTH })
  @IsString({ message: errorConstants.INVALID_DESCRIPTION })
  @IsOptional()
  description?: string;

  @IsOptional()
  playlist?: string;

  @IsArray({ message: errorConstants.INVALID_TAGS_ARRAY })
  @IsString({ each: true, message: errorConstants.INVALID_TAGS_STRING })
  @IsOptional()
  tags?: string[];

  @IsUrl({}, { message: errorConstants.INVALID_THUMBNAIL })
  @IsOptional()
  thumbnail?: string;
}
