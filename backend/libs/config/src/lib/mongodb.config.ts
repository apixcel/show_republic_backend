import { Options } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { PostEntity, ProductEntity } from '@show-republic/entities';

const MongodbConfig: Options<MongoDriver> = {
  entities: [ProductEntity, PostEntity],
  dbName: 'show_republic',
  driver: MongoDriver,
  clientUrl: 'mongodb://root:root@mongo:27017/show_republic?authSource=admin',
  debug: true,
};

export default MongodbConfig;
