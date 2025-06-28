import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { PostCommentEntity, PostCommentReactionEntity } from '@show-republic/entities';

export class PostCommentReactionService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}
  async togglePostCommentReaction(commentId: string, currentUserId: string) {
    const forkedEm = this.em.fork();

    const postCommentRepo = forkedEm.getRepository(PostCommentEntity);
    const postCommentReactionRepo = forkedEm.getRepository(PostCommentReactionEntity);

    const isCommentExist = await postCommentRepo.findOne({ _id: new ObjectId(commentId) });
    if (!isCommentExist) throw new RpcException('Comment not found');

    const isLiked = await postCommentReactionRepo.findOne({ comment: isCommentExist, userId: currentUserId });

    if (isLiked) {
      forkedEm.remove(isLiked);
      isCommentExist.likes = (isCommentExist.likes || 0) - 1;
      await forkedEm.flush();
      return null;
    } else {
      const reaction = postCommentReactionRepo.create({ comment: isCommentExist, userId: currentUserId });
      isCommentExist.likes = (isCommentExist.likes || 0) + 1;
      await forkedEm.persistAndFlush(reaction);

      return reaction;
    }
  }
}
