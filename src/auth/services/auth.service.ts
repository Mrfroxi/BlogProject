import { ResultType } from '../../core/object-result/result.type';
import { ResultStatus } from '../../core/object-result/resultCode';
import { UserOutputDto } from '../../entities/user/dto/user-output.dto';
import { emailExamples } from '../../core/helper/email-template';
import { UserCredentials } from '../dto/userCredentialsDto';
import { ISession } from '../../entities/session/dto/verifyRefToken.dto';
import { BcryptService } from '../../core/services/bcrypt.service';
import { UserService } from '../../entities/user/services/user.service';
import { UserRepository } from '../../entities/user/repositories/user.repository';
import { injectable, inject } from 'inversify';
import { sessionService } from '../../entities/session/services/session.service';
import { nodemailerService } from '../../core/services/nodemailerService';
import { jwtService } from '../../core/services/jwt.service';

@injectable()
export class AuthService {
  constructor(
    @inject(BcryptService) private bcryptService: BcryptService,
    @inject(UserService) private userService: UserService,
    @inject(UserRepository) private userRepository: UserRepository
  ) {}

  async loginUser(
    loginOrEmail: string,
    password: string
  ): Promise<ResultType<{ userId: string } | null>> {
    const userCredentials: UserCredentials | null =
      await this.userRepository.checkUserCredentials(loginOrEmail);

    if (!userCredentials) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'email or login', message: 'Not Found' }],
        errorMessage: 'Not Found',
      };
    }

    const isPasswordValid = await this.bcryptService.userPasswordCompare(
      password,
      userCredentials.hashPassword
    );

    if (!isPasswordValid) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'password', message: 'Not Found' }],
        errorMessage: 'Not Found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: { userId: userCredentials.id },
      extensions: [],
    };
  }

  async confirmationCode(code: string): Promise<ResultType<boolean | null>> {
    const user: ResultType<UserOutputDto | null> =
      await this.userService.verifyUserByCodeFromEmail(code);

    if (!user.data) {
      return {
        status: user.status,
        data: user.data,
        extensions: [...user.extensions],
        errorMessage: user.errorMessage,
      };
    }

    const isConfirmed = user.data.emailConfirmation.isConfirmed;

    if (isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'code', message: 'confirmation code is Confirmed' }],
        errorMessage: 'Confirmation Code is Confirmed',
      };
    }

    const userId = user.data.id;

    const confirmedCode: ResultType<boolean | null> =
      await this.userService.switchConfirmationStatus(userId);

    if (!confirmedCode.data) {
      return {
        status: confirmedCode.status,
        data: null,
        extensions: [...confirmedCode.extensions],
        errorMessage: confirmedCode.errorMessage,
      };
    }

    return {
      status: ResultStatus.Success,
      data: confirmedCode.data,
      extensions: [],
    };
  }

  async resendByEmail(email: string): Promise<ResultType<boolean | null>> {
    const user: ResultType<UserOutputDto | null> = await this.userService.findUserByEmail(email);

    if (!user.data) {
      return {
        status: ResultStatus.BadRequest,
        data: user.data,
        extensions: [{ field: 'email', message: 'email not found' }],
        errorMessage: 'Email not found',
      };
    }

    const isConfirmed = user.data.emailConfirmation.isConfirmed;

    if (isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'email', message: 'isConfirmed' }],
        errorMessage: 'Confirmation Code is Confirmed',
      };
    }

    const newCode = await this.userService.changeConfirmationCode(email);

    if (!newCode.data) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'newCode', message: 'BadRequest code' }],
        errorMessage: 'BadRequest code',
      };
    }

    nodemailerService.sendEmail(user.data.email, newCode.data, emailExamples.registrationEmail);

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: '', message: '' }],
    };
  }

  async logOut(token: string): Promise<ResultType<null | boolean>> {
    const { id, deviceId, iat, exp } = await jwtService.decodeToken(token);

    const payload: ISession = { id, deviceId, iat, exp };

    const foundSession: ResultType<boolean | null> = await sessionService.resetToken(payload);

    if (!foundSession.data) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: ' ', message: ' ' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: '', message: '' }],
    };
  }
}
