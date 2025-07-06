import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class NotificationEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ nullable: false })
  label!: string; //

  @Property({ nullable: false })
  message!: string;
  @Property({ nullable: true })
  image?: string;

  @Property({ nullable: true })
  user?: string;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();
}

@Entity()
export class NotificationPreferencesEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property({ nullable: false })
  user!: string;

  @Property({ type: 'json', nullable: false })
  preferences!: {
    loginActivities: {
      push: boolean;
      email: boolean;
    };
    reminders: {
      push: boolean;
      email: boolean;
    };
  };
}
