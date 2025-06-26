import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class CategoryEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  label!: string;

  @Property()
  value!: string;
}
