import { Migration } from '@mikro-orm/migrations';

export class Migration20250703102534 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "brand_entity" ("id" uuid not null, "user_id" uuid not null, "country" varchar(255) null, constraint "brand_entity_pkey" primary key ("id"));`);
    this.addSql(`alter table "brand_entity" add constraint "brand_entity_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "brand_entity" add constraint "brand_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "brand_entity" cascade;`);
  }

}
