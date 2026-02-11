import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ResultType } from '../../../core/object-result/result.type';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { sessionService } from '../../../entities/session/services/session.service';
import { SessionTokens } from '../../../entities/session/dto/setSession.output.dto';

export const authRefreshTokenHandler = async (req: Request, res: Response) => {
  const updatedSession: ResultType<SessionTokens | null> = await sessionService.updateSession(req);

  if (updatedSession.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(updatedSession.status));
  }

  res.cookie('refreshToken', updatedSession.data?.refreshToken, { httpOnly: true, secure: true });
  return res.status(HttpStatuses.Ok).send({ accessToken: updatedSession.data!.accessToken });
};
