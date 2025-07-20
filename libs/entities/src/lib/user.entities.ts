import { Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { CategoryEntity } from './Category.entities';
import { CreatorEntity } from './Creator.entities';
import { SubscriptionEntity } from './Subscription.entities';
import { UserPreferencesEntity } from './UserPreferences.entities';
// import { PaymentEntity } from './SubscriptionsPayment.entities';
export enum UserStatus {
  ACTIVE = 'active',
  DISABLE = 'disable',
}
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
  BRAND = 'brand',
  USER = 'user',
}

@Entity()
export class UserEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'array', nullable: false })
  @Expose()
  roles: UserRole[] = [UserRole.USER];

  @Property({ nullable: false })
  @Expose()
  firstName!: string;

  @Property({ nullable: false })
  @Expose()
  lastName!: string;

  @Property({ nullable: true })
  @Expose()
  userName?: string;

  @Property({ unique: true, nullable: false })
  @Exclude() // Prevent from being serialized
  email!: string;

  @Property({ nullable: false })
  @Exclude() // Prevent from being serialized
  password!: string;

  @Property({ nullable: true })
  @Expose()
  country?: string;

  @Property({ nullable: true })
  @Expose()
  bio?: string;

  @Property({ nullable: true })
  @Expose()
  websiteUrl?: string;

  @Property({ nullable: true })
  @Expose()
  contactNumber?: string;

  @Property({ nullable: true })
  @Expose()
  profilePicture?: string;

  @Property({ default: UserStatus.ACTIVE })
  @Expose()
  status: UserStatus = UserStatus.ACTIVE;

  @Property({ nullable: true })
  @Expose()
  coverPhoto?: string;

  @ManyToMany(() => CategoryEntity)
  interests = new Collection<CategoryEntity>(this); // Array of interests selected by the user

  @OneToOne(() => UserPreferencesEntity, (preferences) => preferences.user, {
    nullable: true,
  })
  preferences?: UserPreferencesEntity;

  // @OneToMany(() => PaymentEntity, payment => payment.user)
  // payments = new Collection<PaymentEntity>(this);

  @OneToOne(() => CreatorEntity, (account) => account.user, {
    nullable: true,
  })
  creatorAccount?: CreatorEntity;

  @OneToMany(() => SubscriptionEntity, (sub) => sub.subscriber)
  subscriptions = new Collection<SubscriptionEntity>(this);

  @Property({ nullable: true })
  date_of_birth?: Date;
  @Property({ nullable: true })
  banner?: string;

  @Property({ nullable: true, default: Gender.MALE })
  gender: Gender = Gender.MALE;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
