import { IsNotEmpty, IsString } from 'class-validator';
import { errorConstants } from '@show-republic/utils';

export class ChallengeDto {

    @IsNotEmpty({ message: "set coins is required" })
    setCoins!: number;

    @IsNotEmpty({ message: "status must be added" })
    @IsString({ message: "status must be a string" })
    status!: 'live' | 'scheduled';

    @IsNotEmpty({ message: "end date must be added" })
    endDate!: Date;
}
