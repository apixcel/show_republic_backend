import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChallengeDto {
  @IsNotEmpty({ message: 'label is required' })
  label!: string;

  @IsNotEmpty({ message: 'coin is required' })
  coin!: number;

  @IsNotEmpty({ message: 'status must be added' })
  @IsString({ message: 'status must be a string' })
  status!: 'live' | 'scheduled';

  @IsOptional()
  startTime?: Date;

  @IsNotEmpty({ message: 'end date must be added' })
  endTime!: Date;
}
