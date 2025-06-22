import { Entity, PrimaryKey, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { SocialProvider } from '@show-republic/types';
import { UserPreferencesEntity } from './UserPreferences.entities';

@Entity()
export class SocialLoginInfo {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => SocialProvider })
  provider!: SocialProvider;

  @Property()
  providerId!: string;

  @Property()
  accessToken!: string;

  @Property({ nullable: true })
  refreshToken?: string;

  @ManyToOne(() => UserPreferencesEntity)
  user!: UserPreferencesEntity;
}
