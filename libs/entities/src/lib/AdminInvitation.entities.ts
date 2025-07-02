import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class AdminInvitatonEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  email!: string;

  @Property()
  expiresAt!: Date;
}
