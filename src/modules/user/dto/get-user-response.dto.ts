import { User } from 'src/entities';
import { UserNatureEnum, UserRoleEnum } from '../enums';

export class GetUserResponseDto {
  id: string;
  email: string;
  name: string;
  cpf: string;
  nature: UserNatureEnum;
  role: UserRoleEnum;
  phone: string;
  city: string;
  state: string;
  isActive: boolean;

  static fromEntity(user: User): GetUserResponseDto {
    const dto = new GetUserResponseDto();

    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.cpf = user.cpf;
    dto.role = user.role;
    dto.nature = user.nature;
    dto.phone = user.phone;
    dto.city = user.city;
    dto.state = user.state;
    dto.isActive = user.isActive;

    return dto;
  }
}
