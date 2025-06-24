import { Migration } from '@mikro-orm/migrations';

export class Migration20250623110103 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category_entity" ("id" uuid not null, "label" varchar(255) not null, "value" varchar(255) not null, constraint "category_entity_pkey" primary key ("id"));`);

    this.addSql(`create table "user_entity_interests" ("user_entity_id" uuid not null, "category_entity_id" uuid not null, constraint "user_entity_interests_pkey" primary key ("user_entity_id", "category_entity_id"));`);

    this.addSql(`alter table "user_entity_interests" add constraint "user_entity_interests_user_entity_id_foreign" foreign key ("user_entity_id") references "user_entity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_entity_interests" add constraint "user_entity_interests_category_entity_id_foreign" foreign key ("category_entity_id") references "category_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_entity" drop column "interests";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity_interests" drop constraint "user_entity_interests_category_entity_id_foreign";`);

    this.addSql(`drop table if exists "category_entity" cascade;`);

    this.addSql(`drop table if exists "user_entity_interests" cascade;`);

    this.addSql(`alter table "user_entity" add column "interests" jsonb not null;`);
  }

}
