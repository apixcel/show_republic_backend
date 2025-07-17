import { Migration } from '@mikro-orm/migrations';

export class Migration20250717161325 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "brand_entity" alter column "country" type varchar(255) using ("country"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "country" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "brand_entity" alter column "country" type varchar(255) using ("country"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "country" set not null;`);
  }

}
