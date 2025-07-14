import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AddPostToPlaylistDto, PlaylistDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('playlist')
export class PlaylistController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('create')
  async createPlaylist(@Body() playlistDto: PlaylistDto, @Req() req: any) {
    const user = req.user || {};
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'create_playlist' }, { playlistDto, userId: user.userId }),
    );
    return order;
  }

  @Get('my-playlist')
  async getUserPlaylist(@Req() req: any) {
    const user = req.user || {};
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_user_playlist' }, user.userId));
    return order;
  }
  @Get('get/:playlistId')
  async getPlaylistDetailsByPlaylistId(@Req() req: any, @Param('playlistId') playlistId: string) {
    const user = req.user || {};
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'get_playlist_details' }, { userId: user.userId, playlistId }),
    );
    return order;
  }
  @Post('add-post')
  async AddVideoToPlaylistDto(@Body() payload: AddPostToPlaylistDto, @Req() req: any) {
    const user = req.user || {};
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'add_post_to_playlist' }, { payload, userId: user.userId }),
    );
    return order;
  }
}
