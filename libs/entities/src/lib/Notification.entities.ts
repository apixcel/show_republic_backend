import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class NotificationEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ nullable: false })
  label!: string; //

  @Property({ nullable: false })
  message!: string;
  @Property({ nullable: true })
  image?: string;

  @Property({ nullable: true })
  user?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();
}
