import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { PostEntity } from './post.entities';

@Entity()
export class PostCommentEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ type: 'string' })
  userId!: string; // UUID of the commenter

  @ManyToOne(() => PostEntity)
  post!: PostEntity;

  // This comment is a reply to another comment (if any)
  @ManyToOne(() => PostCommentEntity, { nullable: true })
  repliedOf?: PostCommentEntity;

  @Property({ length: 2000 })
  content!: string;

  @Property({ default: 0 })
  likes?: number = 0;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
