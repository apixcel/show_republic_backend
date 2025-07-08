import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Exclude } from 'class-transformer';
@Entity()
export class RoleEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ unique: true })
  name!: string;

  @OneToMany(() => PermissionEntity, (permission) => permission.role, { eager: true })
  permissions = new Collection<PermissionEntity>(this);
}
@Entity()
export class PermissionEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  category!: string;

  @Property()
  action!: string;

  @Exclude()
  @ManyToOne(() => RoleEntity)
  role!: RoleEntity;
}
