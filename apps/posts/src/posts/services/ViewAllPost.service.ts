import { EntityManager as MongoEntityManager, EntityManager as PostgresEntityManager } from '@mikro-orm/core';
import { MongoEntityRepository } from '@mikro-orm/mongodb';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LikeEntity, PostEntity, UserEntity } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';

@Injectable()
export class ViewAllPostService {
  constructor(
    @InjectRepository(PostEntity, 'mongo')
    private readonly postRepository: MongoEntityRepository<PostEntity>,

    @InjectEntityManager('mongo')
    private readonly mongoEm: MongoEntityManager,

    @InjectEntityManager('postgres')
    private readonly pgEm: PostgresEntityManager, // ======== Inject Postgres EntityManager ======>
  ) {}

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
}
