import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/mongodb';
import { PostEntity } from '@show-republic/entities';
import { LikeEntity } from 'libs/entities/src/lib/LikeToogle.entities';

@Injectable()
export class LikeService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,
  ) { }

  async toggleLikeOrDislike(userId: string, postId: string, action: 'like' | 'dislike'): Promise<{ message: string }> {

    const forkedMongoEm = this.mongoEm.fork();
    const post = await forkedMongoEm.findOne(PostEntity, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existing = await forkedMongoEm.findOne(LikeEntity, {
      userId,
      post: post,
    });

    if (!existing) {
      const now = new Date();
      const newLike = forkedMongoEm.create(LikeEntity, {
        userId,
        post,
        type: action,
        createdAt: now,
        updatedAt: now,
      });
      await forkedMongoEm.persistAndFlush(newLike);
      return { message: `You have ${action} this post.` };
    }

    if (existing.type === action) {
      // Already did the same action – remove it (unlike/dislike)
      await forkedMongoEm.removeAndFlush(existing);
      return { message: `You have removed your ${action}.` };
    } else {
      // Switch between like and dislike
      existing.type = action;
      await forkedMongoEm.persistAndFlush(existing);
      return { message: `You have changed your reaction to ${action}.` };
    }
  }

  async countLikes(postId: string): Promise<{ likes: number; dislikes: number }> {

    const forkedMongoEm = this.mongoEm.fork();
    const post = await forkedMongoEm.findOne(PostEntity, postId);
    if (!post) throw new NotFoundException('Post not found');

    const likes = await forkedMongoEm.count(LikeEntity, { post, type: 'like' });
    const dislikes = await forkedMongoEm.count(LikeEntity, { post, type: 'dislike' });

    return { likes, dislikes };
  }
}
