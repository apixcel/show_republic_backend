import { EntityManager } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { RpcException } from '@nestjs/microservices';
import { CreatePostCommentDto } from '@show-republic/dtos';
import { PostCommentEntity, PostEntity } from '@show-republic/entities';

export class CreatePostCommentService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly em: EntityManager,
  ) {}

  async createCommentByPostId(postId: string, createPostCommentDto: CreatePostCommentDto, userId: string) {
    const forkedEm = this.em.fork();
    const postCommentRepo = forkedEm.getRepository(PostCommentEntity);
    const postRepo = forkedEm.getRepository(PostEntity);

    const postObjectId = new ObjectId(postId);
    const post = await postRepo.findOne({ _id: postObjectId });
    if (!post) throw new RpcException('Post not found');

    let repliedOfComment: PostCommentEntity | undefined;

    if (createPostCommentDto.repliedOf) {
      const repliedOfObjectId = new ObjectId(createPostCommentDto.repliedOf);
      // @ts-ignore
      const comment = await postCommentRepo.findOne({ _id: repliedOfObjectId });
      if (!comment) throw new RpcException('Comment not found');

      repliedOfComment = comment;
    }

    const postComment = postCommentRepo.create({
      userId,
      post,
      replyCount: 0,
      likes: 0,
      images: createPostCommentDto.images || [],
      repliedOf: repliedOfComment,
      content: createPostCommentDto.content,
    });

    if (repliedOfComment) {
      repliedOfComment.replyCount = (repliedOfComment.replyCount || 0) + 1;
      await forkedEm.persistAndFlush(repliedOfComment);
    }

    await forkedEm.persistAndFlush(postComment);
    return postComment;
  }
}
