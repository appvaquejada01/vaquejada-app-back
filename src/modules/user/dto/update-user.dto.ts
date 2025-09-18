import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserNatureEnum } from '../enums';
import { User } from 'src/entities';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsEnum(UserNatureEnum)
  nature?: UserNatureEnum;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class UpdateUserResponseDto {
  id: string;
  name: string;
  email: string;
  cpf: string;
  nature: UserNatureEnum;
  phone: string;
  city: string;
  state: string;

  static fromEntity(user: User): UpdateUserResponseDto {
    const dto = new UpdateUserResponseDto();

    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.cpf = user.cpf;
    dto.nature = user.nature;
    dto.phone = user.phone;
    dto.city = user.city;
    dto.state = user.state;

    return dto;
  }
}
