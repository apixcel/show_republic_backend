import { IsNotEmpty, IsString, IsUrl, Length, IsIn, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { errorConstants } from '@show-republic/utils'; // Assuming error constants are defined here
import { DeliveryType } from '@show-republic/types';

export class CreateProductDto {

  @IsString()
  @IsOptional()
  userId!: string;
  
  @IsString({ message: errorConstants.IMAGE_FIELD_STRING })
  @IsUrl({}, { message: errorConstants.IMAGE_FIELD_INVALID_URL })
  @IsNotEmpty({ message: errorConstants.IMAGE_FIELD_REQUIRED })
  image!: string;

  @IsString({ message: errorConstants.PRODUCT_NAME_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.PRODUCT_NAME_FIELD_REQUIRED })
  @Length(2, 50, { message: errorConstants.PRODUCT_NAME_FIELD_LENGTH })
  productName!: string;


  @IsEnum(DeliveryType, { message: errorConstants.DELIVERY_TYPE_FIELD_INVALID})
  deliveryType!: DeliveryType;

  @IsString({ message: errorConstants.STORE_NAME_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.STORE_NAME_FIELD_REQUIRED })
  @Length(2, 50, { message: errorConstants.STORE_NAME_FIELD_LENGTH })
  storeName!: string;

  @IsString({ message: errorConstants.STORE_LINK_FIELD_STRING })
  @IsNotEmpty({ message: errorConstants.STORE_LINK_FIELD_REQUIRED })
  @IsUrl({}, { message: errorConstants.STORE_LINK_FIELD_INVALID_URL })
  storeLink!: string;
  

}
