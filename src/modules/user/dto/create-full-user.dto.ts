import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserNatureEnum, UserRoleEnum } from '../enums';
import { SanitizeNumber } from 'src/shared/decorators/sanitize-number.decorator';
import { User } from 'src/entities';

export class CreateFullUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeNumber()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeNumber()
  phone: string;

  @IsOptional()
  @IsEnum(UserNatureEnum)
  nature?: UserNatureEnum;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  isActive?: boolean;

  static fromEntity(user: User): CreateFullUserDto {
    const dto = new CreateFullUserDto();
    dto.name = user.name;
    dto.email = user.email;
    dto.password = user.password;
    dto.cpf = user.cpf;
    dto.phone = user.phone;
    dto.nature = user.nature;
    dto.role = user.role;
    dto.city = user.city;
    dto.state = user.state;
    dto.isActive = user.isActive;
    return dto;
  }
}
