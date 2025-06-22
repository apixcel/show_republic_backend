import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { errorConstants } from '@show-republic/utils';

export class UserCreatorDto {

  @IsString()
  @IsOptional()
  userId!: string;

  @IsEnum(['FREE'], { message: errorConstants.ACCOUNT_TYPE_FIELD_ENUM })
  @IsNotEmpty({ message: errorConstants.ACCOUNT_TYPE_FIELD_REQUIRED })
  accountType!: 'FREE';

  @IsString({ message: errorConstants.BILLING_PERIOD_FIELD_STRING })
  @IsOptional()
  billingPeriod?: string; // e.g., Monthly, Annually

  @IsString({ message: errorConstants.PAYMENT_METHOD_FIELD_STRING })
  @IsOptional()
  paymentMethod?: string; // e.g., Credit Card, Coins, Bank Transfer

  @IsString({ message: errorConstants.BANK_ACCOUNT_NUMBER_FIELD_STRING })
  @IsOptional()
  bankAccountNumber?: string;

  @IsString({ message: errorConstants.BANK_NAME_FIELD_STRING })
  @IsOptional()
  bankName?: string;

  @IsString({ message: errorConstants.BANK_ACCOUNT_HOLDER_NAME_FIELD_STRING })
  @IsOptional()
  bankAccountHolderName?: string;

}
