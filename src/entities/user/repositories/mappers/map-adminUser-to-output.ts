import { IUser } from '../../../../db/schemas/user.schema';
import { AdminUserOutputDto } from '../../dto/user-output.dto';

export const mapAdminUserToOutput = (user: IUser) => {
  const outputUser: AdminUserOutputDto = {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };

  return outputUser;
};
