import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreatePostCommentDto } from '@show-republic/dtos';
import { PostCommentEntity, PostCommentReactionEntity, PostEntity, UserEntity } from '@show-republic/entities';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,

    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}
  async createCommentByPostId(postId: string, createPostCommentDto: CreatePostCommentDto, userId: string) {
    const forkedEm = this.mongoEm.fork();
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

    post.commentCount = (post.commentCount || 0) + 1;

    await forkedEm.persistAndFlush(postComment);
    await forkedEm.persistAndFlush(post);
    return postComment;
  }

  async getCommentByPostId(postId: string, currentUserId: string) {
    const postCommentRepo = this.mongoEm.fork().getRepository(PostCommentEntity);
    const commentReactionRepo = this.mongoEm.fork().getRepository(PostCommentReactionEntity);
    const postRepo = this.mongoEm.fork().getRepository(PostEntity);

    const userRepo = this.pgEm.fork().getRepository(UserEntity);

    const postObjectId = new ObjectId(postId);
    const isPostExist = await postRepo.findOne({ _id: postObjectId });
    if (!isPostExist) throw new RpcException('Post not found');

    const postComment = await postCommentRepo.find({ post: postObjectId, repliedOf: null });

    let result = [];
    for (const comment of postComment) {
      // console.log({ asf: comment.userId });

      const user = await userRepo.findOne({ id: comment.userId });
      const isLiked = await commentReactionRepo.findOne({ comment: comment._id, userId: currentUserId });
      result.push({
        ...comment,
        isLiked: isLiked ? true : false,
        user: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          username: user?.userName,
          profilePicture: user?.profilePicture,
        },
      });
    }

    return result;
  }

  async getAllCommentReplyByCommentId(commentId: string, currentUserId: string) {
    const postCommentRepo = this.mongoEm.fork().getRepository(PostCommentEntity);
    const userRepo = this.pgEm.fork().getRepository(UserEntity);
    const commentReactionRepo = this.mongoEm.fork().getRepository(PostCommentReactionEntity);

    const postComment = await postCommentRepo.find({ repliedOf: commentId });

    let result = [];
    for (const comment of postComment) {
      const user = await userRepo.findOne({ id: comment.userId });
      if (!user) throw new RpcException('User not found');
      const isLiked = await commentReactionRepo.findOne({ comment: comment._id, userId: currentUserId });
      result.push({
        ...comment,
        isLiked: isLiked ? true : false,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.userName,
          profilePicture: user.profilePicture,
        },
      });
    }

    return result;
  }

  async togglePostCommentReaction(commentId: string, currentUserId: string) {
    const forkedEm = this.mongoEm.fork();

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
