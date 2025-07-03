import { Migration } from '@mikro-orm/migrations';

export class Migration20250703053540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category_entity" ("id" uuid not null, "label" varchar(255) not null, "value" varchar(255) not null, constraint "category_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "user_entity" ("id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "user_name" varchar(255) null, "email" varchar(255) not null, "password" varchar(255) not null, "country" varchar(255) null, "bio" varchar(255) null, "website_url" varchar(255) null, "contact_number" varchar(255) null, "profile_picture" varchar(255) null, "status" varchar(255) not null default 'active', "cover_photo" varchar(255) null, "date_of_birth" timestamptz null, "gender" varchar(255) null default 'male', "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_entity" add constraint "user_entity_email_unique" unique ("email");`);

    this.addSql(`create table "user_creator_entity" ("id" uuid not null, "user_id" uuid not null, "account_type" varchar(255) not null default 'FREE', "billing_period" varchar(255) null, "payment_method" varchar(255) null, "bank_account_number" varchar(255) null, "bank_name" varchar(255) null, "bank_account_holder_name" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_creator_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_creator_entity" add constraint "user_creator_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "user_entity_interests" ("user_entity_id" uuid not null, "category_entity_id" uuid not null, constraint "user_entity_interests_pkey" primary key ("user_entity_id", "category_entity_id"));`);

    this.addSql(`create table "creator_entity" ("id" uuid not null, "account_type" text check ("account_type" in ('free', 'paid')) not null default 'free', "billing_prices" jsonb not null, "accepted_payment_method" jsonb not null, "user_id" uuid not null, "bank_name" varchar(255) not null, "account_number" varchar(255) not null, "account_holder_name" varchar(255) not null, "created_at" date not null, "updated_at" date null, constraint "creator_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "creator_entity" add constraint "creator_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "user_preferences_entity" ("id" uuid not null, "authentication_type" text check ("authentication_type" in ('otp', 'email', 'social')) not null default 'otp', "secret" varchar(255) null, "recovery_codes" text[] null, "enable_two_step_authentication" boolean not null default false, "otp_expiry" timestamptz null, "user_id" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_preferences_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_preferences_entity" add constraint "user_preferences_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "user_subscription_entity" ("id" uuid not null, "subscriber_id" uuid null, "creator_id" uuid null, "is_paid" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_subscription_entity_pkey" primary key ("id"));`);

    this.addSql(`alter table "user_creator_entity" add constraint "user_creator_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_entity_interests" add constraint "user_entity_interests_user_entity_id_foreign" foreign key ("user_entity_id") references "user_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_entity_interests" add constraint "user_entity_interests_category_entity_id_foreign" foreign key ("category_entity_id") references "category_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "creator_entity" add constraint "creator_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_preferences_entity" add constraint "user_preferences_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_subscription_entity" add constraint "user_subscription_entity_subscriber_id_foreign" foreign key ("subscriber_id") references "user_entity" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "user_subscription_entity" add constraint "user_subscription_entity_creator_id_foreign" foreign key ("creator_id") references "user_entity" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity_interests" drop constraint "user_entity_interests_category_entity_id_foreign";`);

    this.addSql(`alter table "user_creator_entity" drop constraint "user_creator_entity_user_id_foreign";`);

    this.addSql(`alter table "user_entity_interests" drop constraint "user_entity_interests_user_entity_id_foreign";`);

    this.addSql(`alter table "creator_entity" drop constraint "creator_entity_user_id_foreign";`);

    this.addSql(`alter table "user_preferences_entity" drop constraint "user_preferences_entity_user_id_foreign";`);

    this.addSql(`alter table "user_subscription_entity" drop constraint "user_subscription_entity_subscriber_id_foreign";`);

    this.addSql(`alter table "user_subscription_entity" drop constraint "user_subscription_entity_creator_id_foreign";`);

    this.addSql(`drop table if exists "category_entity" cascade;`);

    this.addSql(`drop table if exists "user_entity" cascade;`);

    this.addSql(`drop table if exists "user_creator_entity" cascade;`);

    this.addSql(`drop table if exists "user_entity_interests" cascade;`);

    this.addSql(`drop table if exists "creator_entity" cascade;`);

    this.addSql(`drop table if exists "user_preferences_entity" cascade;`);

    this.addSql(`drop table if exists "user_subscription_entity" cascade;`);
  }

}
