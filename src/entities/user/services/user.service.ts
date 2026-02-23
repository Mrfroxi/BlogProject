import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../types/user';
import { validateUserUniqueness } from './helpers/user-validate-uniqueness.helper';
import { UserRepository } from '../repositories/user.repository';
import { UserOutputDto } from '../dto/user-output.dto';
import { BcryptService } from '../../../core/services/bcrypt.service';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { ResultType } from '../../../core/object-result/result.type';
import { add } from 'date-fns';
import { mapUserToOutput } from '../repositories/mappers/map-user-to-output';
import { inject, injectable } from 'inversify';
import { IUser } from '../../../db/schemas/user.schema';

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(BcryptService) private bcryptService: BcryptService
  ) {}

  async findUserById(userId: string): Promise<ResultType<UserOutputDto | null>> {
    const user: UserOutputDto | null = await this.userRepository.findUserById(userId);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'userId', message: 'User Not found' }],
        errorMessage: 'User Not found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async createAdminUser(dto: CreateUserDto): Promise<ResultType<string | null>> {
    const { email, login, password } = dto;

    const isUser: ResultType<boolean | null> = await validateUserUniqueness(
      email,
      login,
      this.userRepository
    );

    if (!isUser.data) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'notUnique', message: 'notUnique' }],
      };
    }

    const hashPassword = await this.bcryptService.userPasswordBcrypt(password);

    const validAdminUser: User = {
      login: login,
      email: email,
      createdAt: `${new Date().toISOString()}`,
      password: hashPassword,
      emailConfirmation: {
        confirmationCode: 'admin',
        expirationDate: null,
        isConfirmed: true,
      },
    };

    const createdUser: IUser = await this.userRepository.createUser(validAdminUser);

    return {
      status: ResultStatus.Success,
      data: createdUser._id.toString(),
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async deleteUser(userId: string): Promise<ResultType<boolean | null>> {
    const user = await this.findUserById(userId);

    if (!user.data) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'userId', message: 'User Not found' }],
        errorMessage: 'User Not found',
      };
    }

    const deletedVerify: boolean = await this.userRepository.deleteUserById(userId);

    if (!deletedVerify) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'userId', message: 'User Not found for delete' }],
        errorMessage: 'User Not found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async findUserByEmail(email: string): Promise<ResultType<UserOutputDto | null>> {
    const validEmail: IUser | null = await this.userRepository.userUniqueEmail(email);

    if (!validEmail) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'email', message: 'email not found' }],
        errorMessage: 'Email Not found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapUserToOutput(validEmail),
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async findUserByLogin(login: string) {
    const validLogin: IUser | null = await this.userRepository.userUniqueLogin(login);

    if (!validLogin) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'login', message: 'login not found' }],
        errorMessage: 'Login Not found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapUserToOutput(validLogin),
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async createUser(dto: CreateUserDto): Promise<ResultType<User | null>> {
    const { email, login, password } = dto;

    const validEmail = await this.findUserByEmail(email);

    if (validEmail.data) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'email', message: 'email exists' }],
        errorMessage: 'Email exists',
      };
    }
    const validLogin = await this.findUserByLogin(login);

    if (validLogin.data) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'login', message: 'login exists' }],
        errorMessage: 'Login exists',
      };
    }

    const hashPassword = await this.bcryptService.userPasswordBcrypt(password);

    const validUser: User = {
      login: login,
      email: email,
      createdAt: `${new Date().toISOString()}`,
      password: hashPassword,
      emailConfirmation: {
        confirmationCode: crypto.randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };

    await this.userRepository.createUser(validUser);

    return {
      status: ResultStatus.Success,
      data: validUser,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async verifyUserByCodeFromEmail(userCode: string) {
    const user: UserOutputDto | null = await this.userRepository.userVerifyCode(userCode);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'code', message: 'confirmation code not exists' }],
        errorMessage: 'Confirmation Code Not Found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async switchConfirmationStatus(userId: string): Promise<ResultType<boolean | null>> {
    const verifiedUser = await this.findUserById(userId);

    if (!verifiedUser.data) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'userId', message: 'BadRequest' }],
        errorMessage: 'BadRequest',
      };
    }

    const userConfirmed: boolean = await this.userRepository.userSwitchEmailIsConfirmed(userId);

    if (!userConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'userId', message: 'BadRequest switch' }],
        errorMessage: 'BadRequest switch',
      };
    }

    return {
      status: ResultStatus.Success,
      data: userConfirmed,
      extensions: [{ field: '', message: '' }],
    };
  }

  async changeConfirmationCode(email: string) {
    const newConfirmedCode = crypto.randomUUID();

    const changedConfirmationCode = await this.userRepository.userChangeConfirmedCode(
      email,
      newConfirmedCode
    );

    if (!changedConfirmationCode) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'ConfirmationCode', message: 'BadRequest change' }],
        errorMessage: 'BadRequest change',
      };
    }

    return {
      status: ResultStatus.Success,
      data: newConfirmedCode,
      extensions: [{ field: '', message: '' }],
    };
  }

  async updatePasswordByCode(
    recoveryCode: string,
    newPassword: string
  ): Promise<ResultType<boolean | null>> {
    const user = await this.userRepository.findUserByEmailCode(recoveryCode);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'recoveryCode', message: 'recoveryCode is incorrect' }],
      };
    }

    const passwordHash = await this.bcryptService.userPasswordBcrypt(newPassword);

    const updated = await this.userRepository.updateUserPasswordByCode(recoveryCode, passwordHash);

    if (!updated) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'updatePassword', message: 'Failed to update password' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: '', message: '' }],
    };
  }
}
