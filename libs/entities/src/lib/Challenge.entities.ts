import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Challenge {
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @Property({ type: 'int', nullable: false })
    setCoins!: number;

    @Property({ type: 'string', length: 20, nullable: false })
    status!: 'live' | 'scheduled';

    @Property({ type: 'timestamp', nullable: false })
    endDate!: Date;
}