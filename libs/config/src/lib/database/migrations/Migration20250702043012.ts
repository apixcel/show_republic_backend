import { Migration } from '@mikro-orm/migrations';

export class Migration20250702043012 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_entity" add column "date_of_birth" timestamptz null, add column "gender" varchar(255) null default 'male';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_entity" drop column "date_of_birth", drop column "gender";`);
  }

}
