import { Migration } from '@mikro-orm/migrations';

export class Migration20250717142042 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "brand_entity" add column "business_name" varchar(255) null, add column "company_rc" varchar(255) null, add column "business_type" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "brand_entity" drop column "business_name", drop column "company_rc", drop column "business_type";`);
  }

}
