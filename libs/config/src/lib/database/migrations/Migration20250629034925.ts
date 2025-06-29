import { Migration } from '@mikro-orm/migrations';

export class Migration20250629034925 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "creator_entity" alter column "bank_name" type varchar(255) using ("bank_name"::varchar(255));`);
    this.addSql(`alter table "creator_entity" alter column "bank_name" set not null;`);
    this.addSql(`alter table "creator_entity" alter column "account_number" type varchar(255) using ("account_number"::varchar(255));`);
    this.addSql(`alter table "creator_entity" alter column "account_number" set not null;`);
    this.addSql(`alter table "creator_entity" alter column "account_holder_name" type varchar(255) using ("account_holder_name"::varchar(255));`);
    this.addSql(`alter table "creator_entity" alter column "account_holder_name" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "creator_entity" alter column "bank_name" type varchar(255) using ("bank_name"::varchar(255));`);
    this.addSql(`alter table "creator_entity" alter column "bank_name" drop not null;`);
    this.addSql(`alter table "creator_entity" alter column "account_number" type varchar(255) using ("account_number"::varchar(255));`);
    this.addSql(`alter table "creator_entity" alter column "account_number" drop not null;`);
    this.addSql(`alter table "creator_entity" alter column "account_holder_name" type varchar(255) using ("account_holder_name"::varchar(255));`);
    this.addSql(`alter table "creator_entity" alter column "account_holder_name" drop not null;`);
  }

}
