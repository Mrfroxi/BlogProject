import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { authService } from '../../services/auth.service';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { ResultType } from '../../../core/object-result/result.type';
import { sessionService } from '../../../entities/session/services/session.service';
import { SessionTokens } from '../../../entities/session/dto/setSession.output.dto';

export const authLoginHandler = async (req: Request, res: Response) => {
  const { loginOrEmail, password } = req.body;

  const resultId: ResultType<{ userId: string } | null> = await authService.loginUser(
    loginOrEmail,
    password
  );

  if (resultId.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(resultId.status)).send(resultId.extensions);
  }

  const userId = resultId.data?.userId as string;

  const setSession: ResultType<SessionTokens | null> = await sessionService.setSession(req, userId);

  if (setSession.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(setSession.status)).send(setSession.extensions);
  }

  res.cookie('refreshToken', setSession.data?.refreshToken, { httpOnly: true, secure: true });
  return res.status(HttpStatuses.Ok).send({ accessToken: setSession.data!.accessToken });
};
