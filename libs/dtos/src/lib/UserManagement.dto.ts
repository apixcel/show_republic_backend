import { IsEnum, IsString } from 'class-validator';

export class ChangeUserStatusDto {
  @IsString()
  userId!: string;
  @IsString()
  @IsEnum(['active', 'disable'], { message: 'status must be "active" or "disable"' })
  status!: string;
}
