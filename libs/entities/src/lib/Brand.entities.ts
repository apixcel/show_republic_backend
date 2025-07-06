import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entities';
@Entity()
export class BrandEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @OneToOne(() => UserEntity, { nullable: false })
  user!: UserEntity;
  @Property({ type: 'string', nullable: true })
  country?: string;
}
