import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostCommentDto {
  @IsOptional()
  @IsString()
  @IsMongoId()
  repliedOf?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
