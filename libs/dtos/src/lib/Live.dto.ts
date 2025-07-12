import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from "class-validator";


export class CreateLiveDto {
    @IsString()
    @IsOptional()
    userId!: string;

    @IsBoolean({ message: 'allow comments must be a boolean' })
    @IsOptional()
    allowComments: boolean = true;

    @IsBoolean({ message: "audience could be , Yes, its Made for kids, or No, its not Made for kids" })
    audience: boolean = false;

    @IsIn(['now', 'later'], { message: 'schedule must be either "now" or "later"' })
    schedule: 'now' | 'later' = 'now';

    @IsArray({ message: "tags must be an array" })
    @IsString({ each: true, message: "tag must be a string" })
    @IsOptional()
    tags: string[] = [];

    @IsOptional()
    @IsString({ message: 'scheduledTime must be a string (ISO date or custom format)' })
    scheduledTime?: string;
}
