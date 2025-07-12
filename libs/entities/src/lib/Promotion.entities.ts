import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";


@Entity()
export class PromotionEntity {
    @PrimaryKey()
    _id!: ObjectId;

    @Property({ type: 'string' })
    userId!: string;

    @Property({ type: 'string' })
    videoUrl!: string;

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'string' })
    category!: string;

    @Property({ length: 1000, type: 'string' })
    description!: string;

    @Property()
    thumbnail!: string;

    @Property()
    goal!: string;

    @Property()
    audience!: boolean;

    @Property({ default: 1 })
    budget!: number;

    @Property({ default: 1 })
    duration!: number;

    @Property({ default: 0 })
    views?: number = 0;

}