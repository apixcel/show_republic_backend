import { Type } from 'class-transformer';
import { IsArray, IsString, MinLength, ValidateNested } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @MinLength(2)
  category!: string;

  @IsString()
  @MinLength(2)
  action!: string;
}

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  permissions!: CreatePermissionDto[];
}

export class UpdateRolePermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  permissions!: CreatePermissionDto[];
}
