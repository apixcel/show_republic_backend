import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { PostCommentEntity } from './PostComment.etnities';

@Entity()
export class PostCommentReactionEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @ManyToOne(() => PostCommentEntity)
  comment!: PostCommentEntity;

  @Property({ type: 'string' })
  userId!: string;
}
