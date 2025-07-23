import { Options } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import {
  AdminEntity,
  AdminInvitatonEntity,
  AdminProfileEntity,
  ChallengeEntity,
  LikeEntity,
  NotificationEntity,
  NotificationPreferencesEntity,
  PermissionEntity,
  PlaylistEntity,
  PostCommentEntity,
  PostCommentReactionEntity,
  PostEntity,
  PostViewEntity,
  ProductEntity,
  RoleEntity,
} from '@show-republic/entities';

const MongodbConfig: Options<MongoDriver> = {
  entities: [
    ProductEntity,
    PostEntity,
    PostCommentEntity,
    LikeEntity,
    PostCommentReactionEntity,
    ChallengeEntity,
    PostViewEntity,
    AdminEntity,
    AdminProfileEntity,
    PlaylistEntity,
    AdminInvitatonEntity,
    NotificationEntity,
    NotificationPreferencesEntity,
    RoleEntity,
    PermissionEntity,
  ],
  dbName: 'show_republic',
  driver: MongoDriver,

  clientUrl: 'mongodb+srv://hammadakram6223:zxDd8HuEaE0Scbot@cluster0.bi4i2.mongodb.net/show_republic',
  debug: true,
};

export default MongodbConfig;
