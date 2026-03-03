import { UserModel } from '../../src/db/schemas/user.schema';
import { IUser } from '../../src/db/schemas/user.schema';

export const takeCodeByCreateMockUser = async function () {
  const newUser = {
    login: 'testUser',
    email: 'test@mail.com',
    password: 'hash_here',
    createdAt: new Date().toISOString(),
    emailConfirmation: {
      confirmationCode: '12345-abcde',
      expirationDate: new Date(Date.now() + 3600000),
      isConfirmed: false,
    },
  };

  const createdUser: IUser = await UserModel.create(newUser);

  return {
    id: createdUser._id.toString(),
    code: newUser.emailConfirmation.confirmationCode,
    email: newUser.email,
  };
};
