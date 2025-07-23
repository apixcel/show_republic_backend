import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class PostViewEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  postId!: string;

  @Property()
  userId!: string;

  @Property()
  viewedAt: Date = new Date();
}
