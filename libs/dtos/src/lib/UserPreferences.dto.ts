import {
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsString,
  IsDate,
  IsNumber,
} from 'class-validator';
import { AuthenticationType } from '@show-republic/types';
import { errorConstants } from '@show-republic/utils';

export class UserPreferencesDto {
  @IsEnum(AuthenticationType, {
    message: errorConstants.INVALID_AUTHENTICATION_TYPE,
  })
  authenticationType: AuthenticationType = AuthenticationType.OTP; // Default value

  @IsOptional()
  @IsNumber()
  secret?: number | null;

  @IsOptional()
  @IsArray({ message: errorConstants.RECOVERY_CODES_MUST_BE_ARRAY })
  @IsString({ each: true, message: errorConstants.RECOVERY_CODES_MUST_BE_STRINGS })
  recoveryCodes?: string[];

  @IsBoolean({
    message: errorConstants.ENABLE_TWO_STEP_AUTHENTICATION_MUST_BE_BOOLEAN,
  })
  enableTwoStepAuthentication = false; // Default value

  @IsOptional()
  @IsDate({ message: errorConstants.OTP_EXPIRY_MUST_BE_DATE })
  otpExpiry?: Date | null;
}
