import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { CreatorEntity } from './Creator.entities';
import { UserEntity } from './user.entities';
@Entity()
export class SubscriptionEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @ManyToOne(() => UserEntity)
  subscriber!: UserEntity;

  @ManyToOne(() => CreatorEntity)
  creator!: CreatorEntity;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Property({ type: 'boolean', default: true })
  isActive: boolean = true;
}
