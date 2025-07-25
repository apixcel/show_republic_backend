import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddPostToPlaylistDto, CreateProductDto, PlaylistDto, UpdateUserDto } from '@show-republic/dtos';
import { PlaylistService } from './services/playlist.service';
import { ProductService } from './services/product.service';
import { ProfileService } from './services/profile.service';

@Controller()
export class AppController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly playlistService: PlaylistService,
    private readonly productService: ProductService,
  ) {}
  @MessagePattern({ cmd: 'my_profile' })
  async getUserProfile(userId: string) {
    return await this.profileService.getUserProfile(userId);
  }
  @MessagePattern({ cmd: 'get_profile_by_id' })
  async getProfileById({ userId, currentUserId }: { userId: string; currentUserId: string }) {
    return await this.profileService.getProfileById(userId, currentUserId);
  }
  @MessagePattern({ cmd: 'update_profile' })
  async updateUserProfile({ userId, userProfileDto }: { userId: string; userProfileDto: UpdateUserDto }) {
    return await this.profileService.updateUserProfile(userProfileDto, userId);
  }

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
  @MessagePattern({ cmd: 'get_public_playlist_by_user_id' })
  getUblicPlaylistByuserId(userId: string) {
    return this.playlistService.getPublicPlaylistByuserId(userId);
  }
  @MessagePattern({ cmd: 'get_playlist_details' })
  getPlaylistDetailsByPlaylistId({ playlistId, userId }: { playlistId: string; userId: string }) {
    return this.playlistService.getPlaylistDetailsByPlaylistId(playlistId, userId);
  }

  // ---- product api start ------

  @MessagePattern({ cmd: 'product_create' })
  createProduct({ ceateProductDto, userId }: { ceateProductDto: CreateProductDto; userId: string }) {
    return this.productService.createProduct(ceateProductDto, userId);
  }
  @MessagePattern({ cmd: 'my_products' })
  getUsersProducts(userId: string) {
    return this.productService.getUsersProducts(userId);
  }
}
