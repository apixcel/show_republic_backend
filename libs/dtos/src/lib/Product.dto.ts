import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsString()
  @IsNotEmpty()
  store_name!: string;

  @IsString()
  @IsNotEmpty()
  store_link!: string;

  @IsString()
  @IsNotEmpty()
  deliveryLocation!: string;
}
