import { Migration } from '@mikro-orm/migrations';

export class Migration20250720111546 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_entity" add column "banner" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity" drop column "banner";`);
  }

}
