import { WithId } from 'mongodb';
import { User } from '../../types/user';
import { UniqueValidateError } from '../../../../core/errors/unique-validate-error';
import { UserRepository } from '../../repositories/user.repository';

export const validateUserUniqueness = async (
  email: string, 
  login: string, 
  userRepository: UserRepository
): Promise<void> => {
  const uniqueEmail: WithId<User> | null = await userRepository.userUniqueEmail(email);

  if (uniqueEmail) {
    throw new UniqueValidateError('email');
  }

  const uniqueLogin: WithId<User> | null = await userRepository.userUniqueLogin(login);

  if (uniqueLogin) {
    throw new UniqueValidateError('login');
  }

  return;
};
