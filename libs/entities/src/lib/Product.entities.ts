import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
@Entity()
export class ProductEntity {
  @PrimaryKey()
  _id!: number;

  @Property()
  title!: string;

  @Property()
  price!: number;

  @Property()
  image!: string;

  @Property()
  description!: string;

  @Property({ type: 'text[]', nullable: true })
  deliveryLocation?: string[]; // Optional; undefined = worldwide

  @Property({ type: 'string' }) // Ensure it's a UUID as a string
  userId!: string; // UUID type for userId

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
