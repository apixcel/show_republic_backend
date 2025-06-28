import { Migration } from '@mikro-orm/migrations';

export class Migration20250628102011 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "creator_entity" drop column "billing_period";`);

    this.addSql(`alter table "creator_entity" add column "billing_prices" jsonb not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "creator_entity" drop column "billing_prices";`);

    this.addSql(`alter table "creator_entity" add column "billing_period" int not null;`);
  }

}
