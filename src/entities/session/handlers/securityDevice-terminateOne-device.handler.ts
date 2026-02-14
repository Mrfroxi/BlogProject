import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';

export const securityDeviceTerminateOneDeviceHandler = async (req: Request, res: Response) => {
  const { userId } = req.session;

  const deviceId = req.params.deviceId;

  const deleteByDeviceId = await sessionService.deleteOneUserSession(userId, deviceId);

  if (deleteByDeviceId.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(deleteByDeviceId.status))
      .send(deleteByDeviceId.extensions);
  }

  res.sendStatus(HttpStatuses.NoContent);
};
