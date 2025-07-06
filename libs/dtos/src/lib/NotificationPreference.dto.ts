import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SingleNotificationPreferenceDto {
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;
}

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SingleNotificationPreferenceDto)
  loginActivities?: SingleNotificationPreferenceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SingleNotificationPreferenceDto)
  reminders?: SingleNotificationPreferenceDto;
}
