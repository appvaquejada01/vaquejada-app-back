import { UserRoleEnum } from 'src/modules/user/enums';

export class AuthenticatedUser {
  userId: string;
  role: UserRoleEnum;
}
