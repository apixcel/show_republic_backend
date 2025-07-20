import { AccountType, BillingPeriod, PaymentMethod } from '@show-republic/entities';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AcceptedPaymentMethodDto {
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsNotEmpty()
  amount!: number;
}

export class CreatorDto {
  @IsEnum(AccountType)
  accountType: AccountType = AccountType.FREE;

  @IsNotEmpty()
  billingPrices!: {
    [key in BillingPeriod]: number;
  };

  @ValidateNested()
  @Type(() => AcceptedPaymentMethodDto)
  acceptedPaymentMethod!: AcceptedPaymentMethodDto;

  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  accountNumber!: string;

  @IsString()
  @IsNotEmpty()
  accountHolderName!: string;
}

export class SubscribeToCreatorDto {
  @IsString()
  @IsNotEmpty()
  creatorId!: string;

  // @IsOptional()
  // @IsEnum(BillingPeriod, {
  //   message: 'billingType must be one of 1, 3, 6, or -1',
  // })
  // billingType?: BillingPeriod;

  // @IsOptional()
  // paymentMethodId?: string;
}
