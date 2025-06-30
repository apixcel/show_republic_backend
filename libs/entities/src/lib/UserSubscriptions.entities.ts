import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from './user.entities';

@Entity()
export class UserSubscriptionEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  subscriber!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  creator!: UserEntity;

  @Property({ default: false })
  isPaid = false;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
