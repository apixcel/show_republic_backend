import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class ChallengeEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ type: 'int', nullable: false })
  coin!: number;

  @Property({ type: 'string', nullable: false })
  label!: string;

  @Property({ type: 'string', length: 20, nullable: false })
  status!: 'live' | 'scheduled';

  @Property({ type: 'datetime', nullable: true })
  startTime?: Date;

  @Property({ type: 'datetime', nullable: false })
  endTime!: Date;
}
