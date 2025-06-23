import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@mikro-orm/nestjs';
import { MongoEntityRepository } from '@mikro-orm/mongodb';
import { EntityManager } from '@mikro-orm/core';
import { PostEntity } from '@show-republic/entities';
import { RpcException } from '@nestjs/microservices';
import { errorConstants } from '@show-republic/utils';

@Injectable()
export class ViewAllPostService {
    constructor(
        @InjectRepository(PostEntity, 'mongo')
        private readonly postRepository: MongoEntityRepository<PostEntity>,

        @InjectEntityManager('mongo')
        private readonly em: EntityManager,
    ) { }

    async viewAll(): Promise<PostEntity[]> {
        const forkedEm = this.em.fork();
        const posts = await forkedEm.getRepository(PostEntity).find({});
        if (!posts || posts.length === 0) {
            throw new RpcException(new NotFoundException(errorConstants.POST_NOT_FOUND));
        }
        return posts;
    }
}

