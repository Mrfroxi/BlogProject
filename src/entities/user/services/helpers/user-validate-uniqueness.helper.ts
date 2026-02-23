import { IUser } from '../../../../db/schemas/user.schema';
import { UserRepository } from '../../repositories/user.repository';
import { ResultStatus } from '../../../../core/object-result/resultCode';
import { ResultType } from '../../../../core/object-result/result.type';

export const validateUserUniqueness = async (
  email: string,
  login: string,
  userRepository: UserRepository
): Promise<ResultType<boolean | null>> => {
  const uniqueEmail: IUser | null = await userRepository.userUniqueEmail(email);

  if (uniqueEmail) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'findEmail', message: 'findEmail' }],
    };
  }

  const uniqueLogin: IUser | null = await userRepository.userUniqueLogin(login);

  if (uniqueLogin) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'findLogin', message: 'findLogin' }],
    };
  }

  return {
    status: ResultStatus.Success,
    data: true,
    extensions: [{ field: '', message: ' ' }],
  };
};
