import { errorConstants } from '@show-republic/utils';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserSubscriptionDto {
  @IsString({ message: errorConstants.SUBSCRIBER_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.SUBSCRIBER_FIELD_REQUIRED })
  subscriber!: string;

  @IsString({ message: errorConstants.CREATERID_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.CREATERID_FIELD_REQUIRED })
  creatorId!: string;

  @IsBoolean()
  isPaid?: boolean;
}
