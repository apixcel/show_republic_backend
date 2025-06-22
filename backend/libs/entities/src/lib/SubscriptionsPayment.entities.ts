// import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
// import { UserEntity } from './user.entities';
// import { v4 as uuidv4 } from 'uuid';
// import { UserCreatorEntity } from './UserCreator.entities';

// @Entity()
// export class PaymentEntity {
//   @PrimaryKey({ type: 'uuid' })
//   id: string = uuidv4();

//   @ManyToOne(() => UserEntity, { nullable: false })
//   user!: UserEntity; // Subscriber making the payment

//   @ManyToOne(() => UserCreatorEntity, { nullable: false })
//   creatorAccount!: UserCreatorEntity;

//   @Property({ type: 'float' })
//   amount!: number;

//   @Property({ nullable: true })
//   paymentMethod?: string; // e.g., Credit Card, Coins, Bank Transfer


//   @Property({ type: 'timestamp', onCreate: () => new Date() })
//   createdAt?: Date = new Date();

//   @Property({ type: 'timestamp', onUpdate: () => new Date() })
//   updatedAt?: Date = new Date();
// }
