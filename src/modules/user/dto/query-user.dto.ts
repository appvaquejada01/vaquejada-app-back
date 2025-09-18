import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../enums';

export class QueryUserDto {
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
