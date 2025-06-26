import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsNotEmpty()
  @IsString()
  value!: string;
}
