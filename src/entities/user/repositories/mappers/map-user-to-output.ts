import { IUser } from '../../../../db/schemas/user.schema';
import { UserOutputDto } from '../../dto/user-output.dto';

export const mapUserToOutput = (user: IUser) => {
  const outputUser: UserOutputDto = {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    emailConfirmation: {
      confirmationCode: user.emailConfirmation.confirmationCode,
      expirationDate: user.emailConfirmation.expirationDate,
      isConfirmed: user.emailConfirmation.isConfirmed,
    },
  };

  return outputUser;
};
