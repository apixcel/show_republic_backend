import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreatePostDto, UpdatePostDto } from '@show-republic/dtos';
import { CreatorEntity, LikeEntity, PlaylistEntity, PostEntity, UserEntity } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';

@Injectable()
export class PostService {
  constructor(
    @InjectEntityManager('mongo')
    private readonly mongoEm: EntityManager,

    @InjectEntityManager('postgres')
    private readonly pgEm: EntityManager,
  ) {}

  async create(data: CreatePostDto) {
    const forkedEm = this.mongoEm.fork();

    const { userId, ...productData } = data;

    const creator = await this.pgEm.fork().getRepository(CreatorEntity).findOne({ user: userId });
    if (!creator) {
      throw new RpcException('Create a creator account to post');
    }
    const post = forkedEm.getRepository(PostEntity).create({
      ...productData,
      userId,
      dislikes: 0,
      creatorId: creator.id,
    });

    if (data.playlist) {
      const playlist = await forkedEm.getRepository(PlaylistEntity).findOne({ _id: new ObjectId(data.playlist) });
      if (playlist) {
        playlist.posts.add(post);
      }
    }

    await forkedEm.persistAndFlush(post);
    return post;
  }

  async updatePost(userId: string, payload: UpdatePostDto, postId: string) {
    const forkedEm = this.mongoEm.fork();

    const postRepo = forkedEm.getRepository(PostEntity);

    const post = await postRepo.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new RpcException('Post not found');
    }

    if (post.userId !== userId) {
      throw new RpcException('You are not allowed to update this post');
    }
    const updatableFields: (keyof PostEntity)[] = [
      'title',
      'description',
      'audience',
      'ageRestriction',
      'tags',
      'category',
      'postType',
      'thumbnail',
      'videoUrl',
    ] as const;

    for (const field of updatableFields) {
      // @ts-ignore
      if (typeof payload[field] !== 'undefined') {
        (post as any)[field] = (payload as any)[field];
      }
    }

    await forkedEm.persistAndFlush(post);
    return post;
  }

  async deletePostById(userId: string, postId: string) {
    const forkedEm = this.mongoEm.fork();

    const postRepo = forkedEm.getRepository(PostEntity);

    const post = await postRepo.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new RpcException('Post not found');
    }

    if (post.userId !== userId) {
      throw new RpcException('You are not allowed to delete this post');
    }

    await forkedEm.removeAndFlush(post);
    return post;
  }

  async viewAll(page = 1, limit = 30, currentUserId?: string): Promise<{ posts: any[]; users?: any[] }> {
    const forkedMongoEm = this.mongoEm.fork();
    const skip = (page - 1) * limit;

    // ============= Fetching a page of posts ============>
    const likedRepo = forkedMongoEm.getRepository(LikeEntity);
    const posts = await forkedMongoEm
      .getRepository(PostEntity)
      .find({}, { limit, offset: skip, orderBy: { createdAt: 'DESC' } });
    if (!posts || posts.length === 0) {
      throw new RpcException(new NotFoundException(errorConstants.POST_NOT_FOUND));
    }

    // ============= Extracting unique userIds for this page =====================>
    const userIds = [...new Set(posts.map((post) => post.userId))];
    if (userIds.length === 0) {
      return { posts: [], users: [] };
    }

    // =========== Fetching only those users depending on the posts fetched ============>
    // ========== and Fork the Postgres EntityManager to avoid conflicts with the main transaction =======>
    let users: UserEntity[];
    try {
      const forkedPgEm = this.pgEm.fork();
      const userRepo = forkedPgEm.getRepository(UserEntity);
      users = await userRepo.find({ id: { $in: userIds } });
    } catch (error) {
      console.log(error);

      throw new RpcException(new InternalServerErrorException('Something went wrong while fetching users'));
    }

    //=========== Remove password from each user object ==========>
    const safeUsers = users.map(({ password, ...user }) => user);

    const userMap = Object.fromEntries(safeUsers.map((user) => [user.id, user]));
    const postsWithUser = posts.map((post) => ({
      ...post,
      _id: undefined,
      id: post._id,
      user: userMap[post.userId] || null,
    }));

    const result = [];

    for (let post of postsWithUser) {
      const isLiked = await likedRepo.findOne({ post: post.id, userId: currentUserId });
      result.push({ ...post, isReacted: isLiked });
    }

    return { posts: result };
  }

  async viewPostByPostId(postId: string, userId: string) {
    // Fork the EntityManager to isolate the transaction
    const forkedEm = this.mongoEm.fork();
    const forkedPgEm = this.pgEm.fork();

    // Query MongoDB for products by userId
    const post = await forkedEm.getRepository(PostEntity).findOne(postId);

    // If no products are found, throw a RpcException
    if (!post) {
      throw new RpcException(new NotFoundException(errorConstants.POST_NOT_FOUND));
    }
    const user = await forkedPgEm.getRepository(UserEntity).findOne({ id: post.userId });

    // Return the products found
    return { ...post, user: user };
  }

  //   view loggedin user posts
  async viewMyPost(userId: string): Promise<PostEntity[]> {
    // Fork the EntityManager to isolate the transaction
    const forkedEm = this.mongoEm.fork();

    // Query MongoDB for products by userId
    const posts = await forkedEm.getRepository(PostEntity).find({ userId });

    // If no products are found, throw a RpcException
    if (!posts || posts.length === 0) {
      throw new RpcException(new NotFoundException(errorConstants.POST_NOT_FOUND));
    }

    // Return the products found
    return posts;
  }
}
