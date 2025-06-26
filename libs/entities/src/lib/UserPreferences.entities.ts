// UserPreferences.ts
import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEntity } from '@show-republic/entities';
import { AuthenticationType } from '@show-republic/types';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class UserPreferencesEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Enum({ items: () => AuthenticationType })
  authenticationType: AuthenticationType = AuthenticationType.OTP;

  @Property({ nullable: true })
  secret?: number | null;

  @Property({ type: 'array', nullable: true })
  recoveryCodes?: string[];

  @Property({ type: Boolean, default: false })
  enableTwoStepAuthentication = false;

  @Property({ type: Date, nullable: true })
  otpExpiry?: Date | null;

  @OneToOne(() => UserEntity, { nullable: true })
  user!: UserEntity;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
