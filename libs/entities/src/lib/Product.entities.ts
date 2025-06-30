import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { DeliveryType } from '@show-republic/types';
@Entity()
export class ProductEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ type: 'string' }) // Ensure it's a UUID as a string
  userId!: string; // UUID type for userId

  @Property({ nullable: false })
  image!: string; // URL for product image

  @Property({ nullable: false })
  productName!: string; // Product name

  @Property({ nullable: false })
  deliveryType!: DeliveryType; // Delivery type (dropdown options)

  @Property({ nullable: false })
  storeName!: string; // Store name

  @Property({ nullable: false })
  storeLink!: string; // URL link to the store

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
