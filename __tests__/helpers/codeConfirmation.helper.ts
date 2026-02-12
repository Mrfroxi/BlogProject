import { userCollection } from '../../src/db/mongo.db';

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

  const createdUser = await userCollection.insertOne(newUser);

  return {
    id: createdUser.insertedId.toString(),
    code: newUser.emailConfirmation.confirmationCode,
    email: newUser.email,
  };
};
