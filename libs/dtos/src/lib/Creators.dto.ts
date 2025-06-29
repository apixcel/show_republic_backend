import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsPositive,
    IsEnum,
    Min,
    Max,
    Length
} from 'class-validator';

export enum AccountType {
    FREE = 'free',
    PAID = 'paid'
}

export enum BillingPeriod {
    MONTHLY = 'monthly',
    THREE_MONTHS = '3 months',
    SIX_MONTHS = '6 months',
    LIFETIME = 'lifetime'
}

export enum PaymentMethod {
    CARD = 'card',
    SHOW_REPUBLIC_COIN = 'show_republic_coin'
}

export class CreateCreatorSubscriptionDto {
    @IsString()
    @IsOptional()
    userId!: string;

    @IsEnum(AccountType, { message: 'Account type must be either free or paid' })
    accountType!: AccountType;

    @IsEnum(BillingPeriod, { message: 'Billing period must be monthly, three_months, six_months, or lifetime' })
    @IsOptional()
    billingPeriod?: BillingPeriod;

    @IsNumber({}, { message: 'Price must be a valid number' })
    @IsPositive({ message: 'Price must be positive' })
    @Min(0, { message: 'Price cannot be negative' })
    @IsOptional()
    price?: number;

    @IsNumber({}, { message: 'Duration must be a valid number' })
    @IsPositive({ message: 'Duration must be positive' })
    @Min(1, { message: 'Duration must be at least 1' })
    @Max(12, { message: 'Duration cannot exceed 12 months' })
    @IsOptional()
    durationInMonths?: number;

    @IsEnum(PaymentMethod, { message: 'Payment method must be card or show_republic_coin' })
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @IsString({ message: 'Bank name must be a string' })
    @IsNotEmpty({ message: 'Bank name is required' })
    @Length(2, 100, { message: 'Bank name must be between 2 and 100 characters' })
    @IsOptional()
    bankName?: string;

    @IsString({ message: 'Account number must be a string' })
    @IsNotEmpty({ message: 'Account number is required' })
    @Length(6, 30, { message: 'Account number must be between 6 and 30 characters' })
    @IsOptional()
    accountNumber?: string;

    @IsString({ message: 'Account holder name must be a string' })
    @IsNotEmpty({ message: 'Account holder name is required' })
    @Length(2, 100, { message: 'Account holder name must be between 2 and 100 characters' })
    @IsOptional()
    accountHolderName?: string;
}