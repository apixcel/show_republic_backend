import { Property } from '@mikro-orm/core';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlaylistDto {
  @IsString()
  name!: string;

  @Property({ default: 'public' })
  privacy!: 'public' | 'private';
}

export class AddPostToPlaylistDto {
  @IsString()
  @IsNotEmpty()
  postId!: string;

  @IsString()
  @IsNotEmpty()
  playlistId!: string;
}
