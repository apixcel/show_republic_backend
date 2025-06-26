import { Migration } from '@mikro-orm/migrations';

export class Migration20241210083051 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_entity" ("id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "user_name" varchar(255) null, "email" varchar(255) not null, "password" varchar(255) not null, "country" varchar(255) null, "bio" varchar(255) null, "website_url" varchar(255) null, "contact_number" varchar(255) null, "profile_picture" varchar(255) null, "cover_photo" varchar(255) null, "interests" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_entity" add constraint "user_entity_email_unique" unique ("email");`);

    this.addSql(`create table "user_creator_entity" ("id" uuid not null, "user_id" uuid not null, "account_type" varchar(255) not null default 'FREE', "billing_period" varchar(255) null, "payment_method" varchar(255) null, "bank_account_number" varchar(255) null, "bank_name" varchar(255) null, "bank_account_holder_name" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_creator_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_creator_entity" add constraint "user_creator_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "playlist_entity" ("id" uuid not null, "name" varchar(255) not null, "user_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "playlist_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "user_preferences_entity" ("id" uuid not null, "authentication_type" text check ("authentication_type" in ('otp', 'email', 'social')) not null default 'otp', "secret" varchar(255) null, "recovery_codes" text[] null, "enable_two_step_authentication" boolean not null default false, "otp_expiry" timestamptz null, "user_id" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_preferences_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_preferences_entity" add constraint "user_preferences_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "user_subscription" ("id" serial primary key, "subscriber_id" uuid null, "creator_id" uuid null, "is_paid" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "user_creator_entity" add constraint "user_creator_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "playlist_entity" add constraint "playlist_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_preferences_entity" add constraint "user_preferences_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_subscription" add constraint "user_subscription_subscriber_id_foreign" foreign key ("subscriber_id") references "user_entity" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "user_subscription" add constraint "user_subscription_creator_id_foreign" foreign key ("creator_id") references "user_entity" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_creator_entity" drop constraint "user_creator_entity_user_id_foreign";`);

    this.addSql(`alter table "playlist_entity" drop constraint "playlist_entity_user_id_foreign";`);

    this.addSql(`alter table "user_preferences_entity" drop constraint "user_preferences_entity_user_id_foreign";`);

    this.addSql(`alter table "user_subscription" drop constraint "user_subscription_subscriber_id_foreign";`);

    this.addSql(`alter table "user_subscription" drop constraint "user_subscription_creator_id_foreign";`);

    this.addSql(`drop table if exists "user_entity" cascade;`);

    this.addSql(`drop table if exists "user_creator_entity" cascade;`);

    this.addSql(`drop table if exists "playlist_entity" cascade;`);

    this.addSql(`drop table if exists "user_preferences_entity" cascade;`);

    this.addSql(`drop table if exists "user_subscription" cascade;`);
  }

}
