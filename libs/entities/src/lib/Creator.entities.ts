import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entities';

export enum AccountType {
  FREE = 'free',
  PAID = 'paid',
}

export enum BillingPeriod {
  MONTHLY = 1,
  THREE_MONTHS = 3,
  SIX_MONTHS = 6,
  LIFETIME = -1,
}

export enum PaymentMethod {
  CARD = 'card',
  SHOW_REPUBLIC_COIN = 'sr_coin',
}

@Entity()
export class CreatorEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Enum(() => AccountType)
  accountType: AccountType = AccountType.FREE;

  @Property({ type: 'json', nullable: false })
  billingPrices?: {
    [key in BillingPeriod]: number;
  };

  @Property({ type: 'json', nullable: false })
  acceptedPaymentMethod!: {
    method: PaymentMethod;
    amount: number;
  };

  @OneToOne(() => UserEntity, { nullable: false })
  user!: UserEntity;

  @Property({ type: 'string', nullable: true })
  country?: string;

  @Property({ type: 'string', nullable: false })
  bankName!: string;

  @Property({ type: 'string', nullable: false })
  accountNumber!: string;

  @Property({ type: 'string', nullable: false })
  accountHolderName!: string;

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
