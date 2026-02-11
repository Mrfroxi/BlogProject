import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ResultType } from '../../../core/object-result/result.type';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { sessionService } from '../../../entities/session/services/session.service';
import { SessionTokens } from '../../../entities/session/dto/setSession.output.dto';

export const authRefreshTokenHandler = async (req: Request, res: Response) => {
  console.log(1);
  const updatedSession: ResultType<SessionTokens | null> = await sessionService.updateSession(req);

  console.log(updatedSession);
  if (updatedSession.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(updatedSession.status))
      .send(updatedSession.extensions);
  }

  res.cookie('refreshToken', updatedSession.data?.refreshToken, { httpOnly: true, secure: true });
  return res.status(HttpStatuses.Ok).send({ accessToken: updatedSession.data!.accessToken });
};
