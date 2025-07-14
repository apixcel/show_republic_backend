import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddPostToPlaylistDto, PlaylistDto } from '@show-republic/dtos';
import { PlaylistService } from './services/playlist.service';

@Controller()
export class AppController {
  constructor(private readonly playlistService: PlaylistService) {}

  @MessagePattern({ cmd: 'create_playlist' })
  createPlaylist({ playlistDto, userId }: { playlistDto: PlaylistDto; userId: string }) {
    return this.playlistService.createPlaylist(playlistDto, userId);
  }
  @MessagePattern({ cmd: 'add_post_to_playlist' })
  addPostToPlaylist({ payload, userId }: { payload: AddPostToPlaylistDto; userId: string }) {
    return this.playlistService.addPostToPlaylist(payload, userId);
  }

  @MessagePattern({ cmd: 'get_user_playlist' })
  getUserPlaylist(userId: string) {
    return this.playlistService.getUserPlaylist(userId);
  }
  @MessagePattern({ cmd: 'get_playlist_details' })
  getPlaylistDetailsByPlaylistId({ playlistId, userId }: { playlistId: string; userId: string }) {
    return this.playlistService.getPlaylistDetailsByPlaylistId(playlistId, userId);
  }
}
