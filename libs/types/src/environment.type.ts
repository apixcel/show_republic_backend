import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvironmentType {
  @IsEnum(['development', 'production'])
  NODE_ENV!: 'development' | 'production';

  @IsInt()
  @IsNotEmpty()
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  EMAIL!: string;

  @IsString()
  @IsNotEmpty()
  PASS!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET_KEY!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRE_KEY!: string;

  @IsNumber()
  @IsNotEmpty()
  DEFAULT_OTP_LENGTH!: number;

  @IsString()
  @IsNotEmpty()
  DEFAULT_ITEM_ALPHABET!: string;

  @IsNumber()
  @IsNotEmpty()
  OTP_EXPIRY_MINUTES!: number;

  @IsString()
  @IsNotEmpty()
  JWT_RESET_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  SERVER_URL!: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL!: string;
}
