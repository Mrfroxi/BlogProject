import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { injectable, inject } from 'inversify';
import { HttpStatuses } from '../../core/types/http-statuses';
import { sessionService } from '../../entities/session/services/session.service';
import { UserQueryRepository } from '../../entities/user/repositories/user-query.repository';
import { UserService } from '../../entities/user/services/user.service';
import { UserAuthMeOutputDto } from '../../entities/user/dto/userAuthMe-output.dto';
import { ResultType } from '../../core/object-result/result.type';
import { ResultStatus } from '../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../core/object-result/resultCodeToHttpException';
import { nodemailerService } from '../../core/services/nodemailerService';
import { emailExamples } from '../../core/helper/email-template';
import { User } from '../../entities/user/types/user';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(UserQueryRepository) private userQueryRepo: UserQueryRepository,
    @inject(UserService) private userService: UserService
  ) {}

  async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body;

    const resultId = await this.authService.loginUser(loginOrEmail, password);

    if (resultId.status !== 'Success') {
      return res.status(HttpStatuses.Unauthorized).send(resultId.extensions);
    }

    const userId = resultId.data?.userId as string;

    const setSession = await sessionService.setSession(req, userId);

    if (setSession.status !== 'Success') {
      return res.status(HttpStatuses.InternalServerError).send(setSession.extensions);
    }

    res.cookie('refreshToken', setSession.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return res.status(HttpStatuses.Ok).send({ accessToken: setSession.data!.accessToken });
  }

  async me(req: Request, res: Response) {
    const userId = req.userId;

    const userData: UserAuthMeOutputDto | null = await this.userQueryRepo.AuthMeById(userId!);

    if (!userData) {
      res.sendStatus(HttpStatuses.Unauthorized);
    }

    res.status(HttpStatuses.Ok).send(userData);
  }

  async registration(req: Request, res: Response) {
    const { email, login, password } = req.body;

    const createdUser: ResultType<User | null> = await this.userService.createUser({
      email,
      login,
      password,
    });

    if (createdUser.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createdUser.status)).send({
        errorsMessages: [...createdUser.extensions],
      });
    }

    //for empty data , ts
    if (createdUser.status !== ResultStatus.Success || !createdUser.data) {
      return res.status(resultCodeToHttpException(createdUser.status)).send({
        errorsMessages: [...createdUser.extensions],
      });
    }

    nodemailerService.sendEmail(
      createdUser.data.email,
      createdUser.data.emailConfirmation.confirmationCode,
      emailExamples.registrationEmail
    );

    res.sendStatus(HttpStatuses.NoContent);
  }

  async registrationConfirmation(req: Request, res: Response) {
    const { code } = req.body;

    const verifyUser: ResultType<boolean | null> = await this.authService.confirmationCode(code);

    if (verifyUser.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(verifyUser.status)).send({
        errorsMessages: [...verifyUser.extensions],
      });
    }

    res.sendStatus(HttpStatuses.NoContent);
  }

  async registrationEmailResending(req: Request, res: Response) {
    const { email } = req.body;

    const verifyUser: ResultType<boolean | null> = await this.authService.resendByEmail(email);

    if (verifyUser.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(verifyUser.status)).send({
        errorsMessages: [...verifyUser.extensions],
      });
    }

    res.sendStatus(HttpStatuses.NoContent);
  }

  async refreshToken(req: Request, res: Response) {
    const updateSession = await sessionService.updateSession(req);

    if (updateSession.status !== 'Success') {
      return res.status(HttpStatuses.InternalServerError).send(updateSession.extensions);
    }

    res.cookie('refreshToken', updateSession.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return res.status(HttpStatuses.Ok).send({ accessToken: updateSession.data!.accessToken });
  }

  async logout(req: Request, res: Response) {
    const token = req.cookies.refreshToken || req.headers.authorization?.replace('Bearer ', '');

    const logOutResult = await this.authService.logOut(token);

    if (logOutResult.status !== 'Success') {
      return res.status(HttpStatuses.Unauthorized).send(logOutResult.extensions);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return res.sendStatus(HttpStatuses.NoContent);
  }
}
