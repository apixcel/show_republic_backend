import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { AdminEntity } from './Admin.entities';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

@Entity()
export class AdminProfileEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  fullName!: string;

  @Property()
  birthDate!: Date;

  @Property()
  gender!: Gender;

  @Property()
  state!: string;

  @Property()
  city!: string;

  @Property()
  maritalStatus!: MaritalStatus;

  @Property()
  nationality!: string;

  @Property()
  timeZone!: string;

  @Property()
  email!: string;

  @Property()
  phoneNumber!: string;

  @Property()
  postalCode!: string;

  @Property()
  address!: string;

  @Property({ type: 'json' })
  emergencyContact!: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address: string;
  };

  @Property({ type: 'json' })
  jobInfo!: {
    position: string;
    workLocation: string;
    jobType: string;
    workEmail: string;
    salary: string;
  };

  @Property({ type: 'json' })
  documents!: Array<{
    type: string;
    name: string;
    url: string;
  }>;

  @OneToOne(() => AdminEntity, { nullable: false })
  admin!: AdminEntity;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
