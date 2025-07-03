import { Migration } from '@mikro-orm/migrations';

export class Migration20250703100152 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "creator_entity" add column "country" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "creator_entity" drop column "country";`);
  }

}
