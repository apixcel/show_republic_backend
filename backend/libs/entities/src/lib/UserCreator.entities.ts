import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { UserEntity } from './user.entities';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class UserCreatorEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @OneToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ nullable: false })
  accountType: 'FREE' = 'FREE'; // Default to 'FREE'

  @Property({ nullable: true })
  billingPeriod?: string; // e.g., Monthly, Annually

  @Property({ nullable: true })
  paymentMethod?: string; // e.g., Credit Card, Coins, Bank Transfer

  @Property({ nullable: true })
  bankAccountNumber?: string;

  @Property({ nullable: true })
  bankName?: string;

  @Property({ nullable: true })
  bankAccountHolderName?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
