import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { AddPostToPlaylistDto, PlaylistDto } from '@show-republic/dtos';
import { PlaylistEntity, PostEntity } from '@show-republic/entities';

export class PlaylistService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}
  async createPlaylist(playlistDto: PlaylistDto, userId: string) {
    const forkedEm = this.em.fork();
    const PlaylistRepo = forkedEm.getRepository(PlaylistEntity);

    const result = PlaylistRepo.create({
      ...playlistDto,
      userId,
      privacy: playlistDto.privacy || 'public',
    });

    await forkedEm.persistAndFlush(result);

    return result;
  }

  async getUserPlaylist(userId: string) {
    const forkedEm = this.em.fork();
    const PlaylistRepo = forkedEm.getRepository(PlaylistEntity);
    const playlist = await PlaylistRepo.find({ userId });

    const result = [];
    if (playlist.length) {
      for (const list of playlist) {
        const firstPostId = list.posts[0]?._id;
        const firstPost = await forkedEm.findOne(PostEntity, { _id: firstPostId });
        result.push({ ...list, playlistThumbnail: firstPost?.thumbnail });
      }
      return result;
    } else {
      return playlist;
    }
  }
  async getPlaylistDetailsByPlaylistId(playlistId: string, userId: string) {
    const forkedEm = this.em.fork();
    const PlaylistRepo = forkedEm.getRepository(PlaylistEntity);
    console.log(playlistId);

    const playlist = await PlaylistRepo.findOne({ _id: new ObjectId(playlistId) }, { populate: ['posts'] });

    if (!playlist) {
      throw new RpcException('Playlist does not exist');
    }

    if (playlist.userId !== userId && playlist.privacy === 'private') {
      throw new RpcException('Forbidden to access playlist');
    }
    return playlist;
  }
  async addPostToPlaylist(payload: AddPostToPlaylistDto, userId: string) {
    const forkedEm = this.em.fork();
    const PlaylistRepo = forkedEm.getRepository(PlaylistEntity);

    const playlist = await PlaylistRepo.findOne({ _id: new ObjectId(payload.playlistId) }, { populate: ['posts'] });

    if (!playlist) {
      throw new RpcException('Playlist does not exist');
    }

    if (playlist.userId !== userId) {
      throw new RpcException('Playlist does not exist');
    }

    const post = await forkedEm.findOne(PostEntity, {
      _id: new ObjectId(payload.postId),
    });

    if (!post) {
      throw new RpcException('Post does not exist');
    }

    if (playlist.posts.contains(post)) {
      throw new RpcException('Post already exists in playlist');
    }

    playlist.posts.add(post);

    await forkedEm.persistAndFlush(playlist);

    return playlist;
  }
}
