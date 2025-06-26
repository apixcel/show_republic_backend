import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@mikro-orm/nestjs';
import { MongoEntityRepository } from '@mikro-orm/mongodb';
import { PostEntity } from '@show-republic/entities';
import { EntityManager } from '@mikro-orm/core';
import { CreatePostDto } from '@show-republic/dtos';

@Injectable()
export class CreatePostService {
  constructor(
    @InjectRepository(PostEntity, 'mongo') // Specify the 'mongo' context
    private readonly postRepository: MongoEntityRepository<PostEntity>, // MongoDB repository for products

    @InjectEntityManager('mongo') // Inject EntityManager for MongoDB context
    private readonly em: EntityManager
  ) {}

  async create(data: CreatePostDto): Promise<PostEntity> {
    const forkedEm = this.em.fork(); // Forking MongoDB EntityManager

    const { userId, ...productData } = data;

    // Create and persist the product entity in MongoDB
    const post= forkedEm.getRepository(PostEntity).create({
      ...productData,
      userId, // Assign userId directly from the data
    });

    await forkedEm.persistAndFlush(post); // Persist the entity using the forked EntityManager
    return post;
  }
}
