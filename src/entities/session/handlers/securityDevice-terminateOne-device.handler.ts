import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';

export const securityDeviceTerminateOneDeviceHandler = async (req: Request, res: Response) => {
  const { userId } = req.session;

  const deviceId = req.params.deviceId;

  const deletByDeviceId = await sessionService.deleteOneUserSession(userId, deviceId);

  if (deletByDeviceId.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(deletByDeviceId.status))
      .send(deletByDeviceId.extensions);
  }

  res.sendStatus(HttpStatuses.NoContent);
};
