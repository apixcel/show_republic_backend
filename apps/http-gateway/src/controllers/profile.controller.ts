import { Body, Controller, Get, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AddPostToPlaylistDto, CreateProductDto, PlaylistDto, UpdateUserDto } from '@show-republic/dtos';
import { lastValueFrom } from 'rxjs';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get('my')
  async getUserProfile(@Req() req: any) {
    const user = req.user || {};

    return await lastValueFrom(this.natsClient.send({ cmd: 'my_profile' }, user?.userId));
  }
  @Put('my/update')
  async updateUserProfile(@Req() req: any, @Body() userProfileDto: UpdateUserDto) {
    const user = req.user || {};
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'update_profile' }, { userId: user?.userId, userProfileDto }),
    );
  }

  // ----- playlist api start --------
  @Post('/playlist/create')
  async createPlaylist(@Body() playlistDto: PlaylistDto, @Req() req: any) {
    const user = req.user || {};
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'create_playlist' }, { playlistDto, userId: user.userId }),
    );
    return order;
  }

  @Get('playlist/my-playlist')
  async getUserPlaylist(@Req() req: any) {
    const user = req.user || {};
    const order = await lastValueFrom(this.natsClient.send({ cmd: 'get_user_playlist' }, user.userId));
    return order;
  }
  @Get('playlist/get/:playlistId')
  async getPlaylistDetailsByPlaylistId(@Req() req: any, @Param('playlistId') playlistId: string) {
    const user = req.user || {};
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'get_playlist_details' }, { userId: user.userId, playlistId }),
    );
    return order;
  }
  @Post('playlist/add-post')
  async AddVideoToPlaylistDto(@Body() payload: AddPostToPlaylistDto, @Req() req: any) {
    const user = req.user || {};
    const order = await lastValueFrom(
      this.natsClient.send({ cmd: 'add_post_to_playlist' }, { payload, userId: user.userId }),
    );
    return order;
  }

  // ------- product api start ------

  @Post('product/create')
  async createProduct(@Body() ceateProductDto: CreateProductDto, @Req() req: any) {
    const user = req.user || {};
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'product_create' }, { ceateProductDto, userId: user.userId }),
    );
  }
  @Get('product/get/my')
  async getUsersProducts(@Req() req: any) {
    const user = req.user || {};
    return await lastValueFrom(this.natsClient.send({ cmd: 'my_products' }, user.userId));
  }
}
