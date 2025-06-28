import { Options } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import {
  AdminEntity,
  ChallengeEntity,
  LikeEntity,
  PostCommentEntity,
  PostCommentReactionEntity,
  PostEntity,
  ProductEntity,
} from '@show-republic/entities';

const MongodbConfig: Options<MongoDriver> = {
  entities: [
    ProductEntity,
    PostEntity,
    PostCommentEntity,
    LikeEntity,
    PostCommentReactionEntity,
    ChallengeEntity,
    AdminEntity,
  ],
  dbName: 'show_republic',
  driver: MongoDriver,
  clientUrl: 'mongodb+srv://hammadakram6223:zxDd8HuEaE0Scbot@cluster0.bi4i2.mongodb.net/show_republic',
  debug: true,
};

export default MongodbConfig;
