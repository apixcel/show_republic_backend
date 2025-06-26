import { errorConstants } from '@show-republic/utils';
import {
  IsString,

  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreatePlaylistDto {

  @IsString()
  @IsOptional()
  userId!: string;

  @IsString({message: errorConstants.PLAYLIST_NAME})
  @IsNotEmpty({message: errorConstants.PLAYLIST_NAME_REQUIRED} )
  name!: string;

}
