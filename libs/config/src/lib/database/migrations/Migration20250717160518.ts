import { Migration } from '@mikro-orm/migrations';

export class Migration20250717160518 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "brand_entity" alter column "business_name" type varchar(255) using ("business_name"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "business_name" set not null;`);
    this.addSql(`alter table "brand_entity" alter column "business_type" type varchar(255) using ("business_type"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "business_type" set not null;`);
    this.addSql(`alter table "brand_entity" alter column "country" type varchar(255) using ("country"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "country" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "brand_entity" alter column "business_name" type varchar(255) using ("business_name"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "business_name" drop not null;`);
    this.addSql(`alter table "brand_entity" alter column "business_type" type varchar(255) using ("business_type"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "business_type" drop not null;`);
    this.addSql(`alter table "brand_entity" alter column "country" type varchar(255) using ("country"::varchar(255));`);
    this.addSql(`alter table "brand_entity" alter column "country" drop not null;`);
  }

}
