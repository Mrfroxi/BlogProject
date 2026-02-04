import { WithId } from 'mongodb';
import { User } from '../../types/user';
import { AdminUserOutputDto } from '../../dto/user-output.dto';

export const mapAdminUserToOutput = (user: WithId<User>) => {
  const outputUser: AdminUserOutputDto = {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };

  return outputUser;
};
