import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';

export const securityDeviceTerminateAllDeviceSHandler = async (req: Request, res: Response) => {
  const { userId, deviceId } = req.session;

  const deletedSessions = await sessionService.deleteUserSessions(userId, deviceId);

  if (deletedSessions.status !== ResultStatus.Success) {
    return res
      .status(resultCodeToHttpException(deletedSessions.status))
      .send(deletedSessions.extensions);
  }

  res.sendStatus(HttpStatuses.NoContent);
};
