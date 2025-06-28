import { Migration } from '@mikro-orm/migrations';

export class Migration20250628104737 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "creator_entity" add column "bank_name" varchar(255) null, add column "account_number" varchar(255) null, add column "account_holder_name" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "creator_entity" drop column "bank_name", drop column "account_number", drop column "account_holder_name";`);
  }

}
