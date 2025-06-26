import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostCommentDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  postId!: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  repliedOf?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;
}
