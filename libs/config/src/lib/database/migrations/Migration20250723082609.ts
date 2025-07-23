import { Migration } from '@mikro-orm/migrations';

export class Migration20250723082609 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "subscription_entity" add column "post_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "subscription_entity" drop column "post_id";`);
  }

}
