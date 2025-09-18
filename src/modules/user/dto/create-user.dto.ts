import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  static fromEntity(createdUser: User): CreateUserDto {
    const dto = new CreateUserDto();

    dto.email = createdUser.email;
    dto.name = createdUser.name;
    dto.password = createdUser.password;
    dto.cpf = createdUser.cpf;

    return dto;
  }
}
