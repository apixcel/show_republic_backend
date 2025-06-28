import { Migration } from '@mikro-orm/migrations';

export class Migration20250628095848 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "creator_entity" ("id" uuid not null, "account_type" text check ("account_type" in ('free', 'paid')) not null default 'free', "billing_period" int not null, "accepted_payment_method" jsonb not null, "user_id" uuid not null, "created_at" date not null, "updated_at" date null, constraint "creator_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "creator_entity" add constraint "creator_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "creator_entity" add constraint "creator_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "creator_entity" cascade;`);
  }

}
