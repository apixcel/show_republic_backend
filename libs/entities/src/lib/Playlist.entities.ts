import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { PostEntity } from './post.entities';

@Entity()
export class PlaylistEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ nullable: false })
  name!: string;

  userId!: string;

  @ManyToMany(() => PostEntity)
  posts = new Collection<PostEntity>(this); // acts like an array

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
