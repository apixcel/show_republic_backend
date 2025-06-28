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

  async toggleLikeOrDislike(
    userId: string,
    postId: string,
    action: 'like' | 'dislike'
  ): Promise<{ message: string; likes: number; dislikes: number; userReaction: 'like' | 'dislike' | null }> {
    const forkedMongoEm = this.mongoEm.fork();

    //  Find post and existing reaction in single transaction
    const [post, existing] = await Promise.all([
      forkedMongoEm.findOneOrFail(PostEntity, postId),
      forkedMongoEm.findOne(LikeEntity, { userId, post: postId })
    ]);

    let message: string;
    let userReaction: 'like' | 'dislike' | null = null;

    //  Handle all three cases (new reaction, remove, or toggle)
    if (!existing) {
      //  New reaction
      const newReaction = forkedMongoEm.create(LikeEntity, {
        userId,
        post,
        type: action,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await forkedMongoEm.persistAndFlush(newReaction);
      // @ts-ignore

      post[action + 's']++; // Increment like/dislike count
      message = `You have ${action}d this post.`;
      userReaction = action;
    }
    else if (existing.type === action) {
      // Remove existing reaction
      await forkedMongoEm.removeAndFlush(existing);
      // @ts-ignore

      post[action + 's']--; // Decrement count
      message = `You have removed your ${action}.`;
      userReaction = null;
    }
    else {
      //  Switch reaction (like ↔ dislike)
      const oldAction = existing.type;
      existing.type = action;
      existing.updatedAt = new Date();
      // @ts-ignore
      post[oldAction + 's']--; // Decrement old reaction
      // @ts-ignore
      post[action + 's']++;    // Increment new reaction

      await forkedMongoEm.persistAndFlush(existing);
      message = `You changed to ${action}.`;
      userReaction = action;
    }

    //  Update post counts and return all data
    await forkedMongoEm.persistAndFlush(post);

    return {
      message,
      // @ts-ignore
      likes: post.likes,
      // @ts-ignore
      dislikes: post.dislikes,
      userReaction
    };
  }



  async getAllReactions(): Promise<LikeEntity[]> {
    const forkedMongoEm = this.mongoEm.fork();
    const reactions = await forkedMongoEm.find(LikeEntity, {});
    if (!reactions || reactions.length === 0) {
      throw new NotFoundException('No reaction found');
    }

    return reactions;
  }

}
