import { 
  Entity, 
  PrimaryKey, 
  Property, 
  OneToOne, 
  OneToMany, 
  Collection 
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Exclude, Expose } from 'class-transformer';
import { UserPreferencesEntity } from './UserPreferences.entities';
import { UserSubscription } from './UserSubscriptions.entities';
import { UserCreatorEntity} from './UserCreator.entities';
// import { PaymentEntity } from './SubscriptionsPayment.entities';

@Entity()
export class UserEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

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

  @Property({ nullable: true })
  @Expose()
  coverPhoto?: string;

  @Property({ type: 'json', nullable: false})
  @Expose()
  interests!: string[]; // Array of interests selected by the user

  @OneToOne(() => UserPreferencesEntity, preferences => preferences.user, { nullable: true })
  preferences?: UserPreferencesEntity;

  @OneToMany(() => UserSubscription, subscription => subscription.subscriber)
  subscriptions = new Collection<UserSubscription>(this);

  @OneToMany(() => UserSubscription, subscription => subscription.creator)
  @Expose()
  subscribers = new Collection<UserSubscription>(this);

  // @OneToMany(() => PaymentEntity, payment => payment.user)
  // payments = new Collection<PaymentEntity>(this);

  @OneToOne(() => UserCreatorEntity, account => account.user, { nullable: true })
  creatorAccount?: UserCreatorEntity;

  @Property({ type: 'timestamp', onCreate: () => new Date() })
  createdAt?: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}
