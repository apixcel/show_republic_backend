import { Entity, PrimaryKey, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { PostEntity } from './post.entities';

@Entity()
@Unique({ properties: ['userId', 'post'] }) // Prevent duplicates
export class LikeEntity {
    @PrimaryKey()
    _id!: ObjectId;

    @Property()
    userId!: string;

    @ManyToOne(() => PostEntity)
    post!: PostEntity;

    @Property()
    type!: 'like' | 'dislike';

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
