import { IUser } from '../../../../db/schemas/user.schema';
import { UserAuthMeOutputDto } from '../../dto/userAuthMe-output.dto';

export const mapUserAuthMeToOutput = (user: IUser) => {
  const outputUser: UserAuthMeOutputDto = {
    userId: user._id.toString(),
    login: user.login,
    email: user.email,
  };

  return outputUser;
};
