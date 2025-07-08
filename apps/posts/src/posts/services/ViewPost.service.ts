import { EntityManager } from '@mikro-orm/core';
import { MongoEntityRepository } from '@mikro-orm/mongodb';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PostEntity } from '@show-republic/entities';
import { errorConstants } from '@show-republic/utils';

@Injectable()
export class ViewPostService {
  constructor(
    @InjectRepository(PostEntity, 'mongo') // Specify the 'mongo' context
    private readonly postRepository: MongoEntityRepository<PostEntity>, // MongoDB repository for products

    @InjectEntityManager('mongo') // Inject EntityManager for MongoDB context
    private readonly em: EntityManager,
  ) {}

  async view(userId: string): Promise<PostEntity[]> {
    // Fork the EntityManager to isolate the transaction
    const forkedEm = this.em.fork();

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
