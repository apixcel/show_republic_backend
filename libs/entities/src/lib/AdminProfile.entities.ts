import { Entity, PrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}
@Entity()
export class AdminProfileEntity {
  @PrimaryKey()
  _id!: ObjectId;
  fullName!: string;
  birthDate!: Date;
  gender!: Gender;
  state!: string;
  city!: string;
  maritalStatus!: MaritalStatus;
  nationality!: string;
  timeZone!: string;
  email!: string;
  phoneNumber!: string;
  postalCode!: string;
  address!: string;

  emergencyContact!: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address: string;
  };

  jobInfo!: {
    position: string;
    workLocation: string;
    jobType: string;
    workEmail: string;
    salary: string;
  };

  documents!: [
    {
      type: string;
      name: string;
      url: string;
    },
  ];

  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();
}
