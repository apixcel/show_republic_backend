import { Migration } from '@mikro-orm/migrations';

export class Migration20250720062715 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_entity" drop column "stripe_customer_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity" add column "stripe_customer_id" varchar(255) not null;`);
  }

}
