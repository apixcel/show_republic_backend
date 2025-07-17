import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
@Entity()
export class ProductEntity {
  @PrimaryKey()
  _id!: number;

  @Property()
  title!: string;

  @Property()
  image!: string;


  @Property({ type: 'string', nullable: false })
  deliveryLocation!: string;

  @Property({ type: 'string', nullable: false })
  store_name!: string;

  @Property({ type: 'string', nullable: false })
  store_link!: string;

  @Property({ type: 'string' }) // Ensure it's a UUID as a string
  userId!: string; // UUID type for userId

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
