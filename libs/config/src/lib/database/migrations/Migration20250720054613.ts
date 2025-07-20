import { Migration } from '@mikro-orm/migrations';

export class Migration20250720054613 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_entity" add column "roles" text[] not null, add column "stripe_customer_id" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity" drop column "roles", drop column "stripe_customer_id";`);
  }

}
