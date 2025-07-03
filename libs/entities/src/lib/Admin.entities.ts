import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
export enum AdminStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
}
@Entity()
export class AdminEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ nullable: false })
  firstName!: string; // Product name

  @Property({ nullable: false })
  lastName!: string; //

  @Property({ nullable: false })
  username!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  role!: string; //

  @Property({ nullable: false })
  image!: string; // URL for product image

  @Property({ nullable: false })
  phone!: string;

  @Enum(() => AdminStatus)
  status: AdminStatus = AdminStatus.ACTIVE;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
