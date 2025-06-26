import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entities';

@Entity()
export class PlaylistEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ nullable: false })
  name!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
