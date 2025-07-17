import { IsOptional, IsString } from 'class-validator';

export class BrandDto {
  @IsString()
  businessName!: string;

  @IsString()
  @IsOptional()
  companyRC?: string;

  @IsString()
  businessType!: string;

  @IsString()
  @IsOptional()
  country?: string;
}
