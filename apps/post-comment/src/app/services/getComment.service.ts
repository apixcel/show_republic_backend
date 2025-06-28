import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { PostCommentEntity, PostEntity, UserEntity } from '@show-republic/entities';

export class GetPostCommentService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,

    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}

  async getCommentByPostId(postId: string) {
    const postCommentRepo = this.mongoEm.fork().getRepository(PostCommentEntity);
    const postRepo = this.mongoEm.fork().getRepository(PostEntity);

    const userRepo = this.pgEm.fork().getRepository(UserEntity);

    const postObjectId = new ObjectId(postId);
    const isPostExist = await postRepo.findOne({ _id: postObjectId });
    if (!isPostExist) throw new RpcException('Post not found');

    const postComment = await postCommentRepo.find({ post: postObjectId, repliedOf: null });

    let result = [];
    for (const comment of postComment) {
      const user = await userRepo.findOne({ id: comment.userId });
      if (!user) throw new RpcException('User not found');
      result.push({
        ...comment,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.userName,
        },
      });
    }

    return result;
  }

  async getAllCommentReplyByCommentId(commentId: string) {
    const postCommentRepo = this.mongoEm.fork().getRepository(PostCommentEntity);
    const userRepo = this.pgEm.fork().getRepository(UserEntity);
    const postComment = await postCommentRepo.find({ repliedOf: commentId });

    let result = [];
    for (const comment of postComment) {
      const user = await userRepo.findOne({ id: comment.userId });
      if (!user) throw new RpcException('User not found');
      result.push({
        ...comment,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.userName,
        },
      });
    }

    return result;
  }
}
