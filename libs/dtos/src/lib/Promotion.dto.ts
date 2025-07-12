import {
    IsString,
    IsInt,
    IsOptional,
    IsNotEmpty,
    IsUrl,
    Length,
    IsBoolean,
    Min,
} from 'class-validator';

import { errorConstants } from '@show-republic/utils';

export class CreatePromotionDto {
    @IsString()
    @IsOptional()
    userId!: string;

    @IsUrl({}, { message: errorConstants.INVALID_VIDEO_URL })
    @IsNotEmpty({ message: errorConstants.VIDEO_URL_REQUIRED })
    videoUrl!: string;

    @Length(0, 100, { message: errorConstants.TITLE_LENGTH })
    @IsString({ message: errorConstants.INVALID_TITLE })
    title!: string;

    @Length(0, 1000, { message: errorConstants.DESCRIPTION_LENGTH })
    @IsString({ message: errorConstants.INVALID_DESCRIPTION })
    @IsOptional()
    description?: string;

    @IsString({ message: errorConstants.INVALID_CATEGORY })
    category!: string;

    @IsUrl({}, { message: errorConstants.INVALID_THUMBNAIL })
    @IsNotEmpty({ message: errorConstants.THUMBNAIL_REQUIRED })
    thumbnail!: string;

    @IsString({ message: "goal must be a string" })
    goal!: string;

    @IsBoolean({ message: "audience could be , Yes, its Made for kids, or No, its not Made for kids" })
    audience: boolean = false;

    @IsInt({ message: "budget must be added" })
    @Min(0, { message: "budget can't be negative" })
    budget: number = 0;

    @IsInt({ message: "duration must be added" })
    @Min(1, { message: "duration have to be minimum 1 days" })
    duration: number = 1;

    @IsInt({ message: errorConstants.INVALID_VIEWS_COUNT })
    @IsOptional()
    views: number = 0;
}
