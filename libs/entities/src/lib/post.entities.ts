import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { PostType } from '@show-republic/types';
@Entity()
export class PostEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ type: 'string' }) // Ensure it's a UUID as a string
  userId!: string; // UUID type for userId

  @Property({ type: 'string', nullable: true   }) // Ensure it's a UUID as a string
  creatorId?: string; // UUID type for creatorAccount

  @Property({ type: 'string' })
  postType!: PostType;

  @Property({ type: 'string' })
  category?: string;

  @Property()
  title!: string;

  @Property()
  videoUrl!: string;

  @Property({ default: 0 })
  views?: number = 0;

  @Property({ default: 0 })
  likes?: number = 0;

  @Property({ default: 0 })
  commentCount?: number = 0;

  @Property({ default: 0 })
  dislikes: number = 0;

  @Property({ length: 5000, nullable: true })
  description?: string;

  @Property({ type: 'json', nullable: true })
  tags?: string[] = [];

  @Property()
  thumbnail!: string;

  @Property({ nullable: true, type: 'string' })
  playlist?: string;

  @Property({ nullable: true, type: 'string' })
  audience?: string;

  @Property({ nullable: true, type: 'string' })
  ageRestriction?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
