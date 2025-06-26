import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUrl,
  Length,
} from 'class-validator';

import { errorConstants } from '@show-republic/utils';
import { PostType } from '@show-republic/types';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  userId!: string;

  @IsEnum(PostType, { message: errorConstants.INVALID_POST_TYPE })
  postType!: PostType;

  @IsString({ message: errorConstants.INVALID_CATEGORY })
  category!: string;

  @Length(0, 100, { message: errorConstants.TITLE_LENGTH })
  @IsString({ message: errorConstants.INVALID_TITLE })
  title!: string;

  @IsUrl({}, { message: errorConstants.INVALID_VIDEO_URL })
  @IsNotEmpty({ message: errorConstants.VIDEO_URL_REQUIRED })
  videoUrl!: string;

  @IsInt({ message: errorConstants.INVALID_VIEWS_COUNT })
  @IsOptional()
  views: number = 0;

  @IsInt({ message: errorConstants.INVALID_LIKES_COUNT })
  @IsOptional()
  likes: number = 0;

  @Length(0, 1000, { message: errorConstants.DESCRIPTION_LENGTH })
  @IsString({ message: errorConstants.INVALID_DESCRIPTION })
  @IsOptional()
  description?: string;

  @IsArray({ message: errorConstants.INVALID_TAGS_ARRAY })
  @IsString({ each: true, message: errorConstants.INVALID_TAGS_STRING })
  @IsOptional()
  tags: string[] = [];

  @IsUrl({}, { message: errorConstants.INVALID_THUMBNAIL })
  @IsNotEmpty({ message: errorConstants.THUMBNAIL_REQUIRED })
  thumbnail!: string;
}
