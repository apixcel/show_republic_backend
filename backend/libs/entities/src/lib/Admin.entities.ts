import { Entity, ManyToOne, PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
@Entity()
export class AdminEntity {

  @PrimaryKey()
  _id!: ObjectId;


  @Property({ type: 'string' }) // Ensure it's a UUID as a string
  userId!: string; // UUID type for userId

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

  @Property({ nullable: false, type: 'string', })
  status!: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
