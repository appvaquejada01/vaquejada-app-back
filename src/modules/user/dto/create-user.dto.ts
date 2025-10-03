import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities';
import { SanitizeNumber } from 'src/shared/decorators';

export class CreateUserDto {
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

  static fromEntity(createdUser: User): CreateUserDto {
    const dto = new CreateUserDto();

    dto.email = createdUser.email;
    dto.name = createdUser.name;
    dto.password = createdUser.password;
    dto.phone = createdUser.phone;
    dto.cpf = createdUser.cpf;

    return dto;
  }
}
