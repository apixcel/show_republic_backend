import { Migration } from '@mikro-orm/migrations';

export class Migration20250720070354 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "subscription_entity" ("id" uuid not null, "subscriber_id" uuid not null, "creator_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "is_active" boolean not null default true, constraint "subscription_entity_pkey" primary key ("id"));`);

    this.addSql(`alter table "subscription_entity" add constraint "subscription_entity_subscriber_id_foreign" foreign key ("subscriber_id") references "user_entity" ("id") on update cascade;`);
    this.addSql(`alter table "subscription_entity" add constraint "subscription_entity_creator_id_foreign" foreign key ("creator_id") references "creator_entity" ("id") on update cascade;`);

    this.addSql(`drop table if exists "user_creator_entity" cascade;`);

    this.addSql(`drop table if exists "user_subscription_entity" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user_creator_entity" ("id" uuid not null, "user_id" uuid not null, "account_type" varchar(255) not null default 'FREE', "billing_period" varchar(255) null, "payment_method" varchar(255) null, "bank_account_number" varchar(255) null, "bank_name" varchar(255) null, "bank_account_holder_name" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_creator_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_creator_entity" add constraint "user_creator_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "user_subscription_entity" ("id" uuid not null, "subscriber_id" uuid null, "creator_id" uuid null, "is_paid" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_subscription_entity_pkey" primary key ("id"));`);

    this.addSql(`alter table "user_creator_entity" add constraint "user_creator_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "user_subscription_entity" add constraint "user_subscription_entity_subscriber_id_foreign" foreign key ("subscriber_id") references "user_entity" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "user_subscription_entity" add constraint "user_subscription_entity_creator_id_foreign" foreign key ("creator_id") references "user_entity" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "subscription_entity" cascade;`);
  }

}
