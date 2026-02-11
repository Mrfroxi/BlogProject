import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { sessionQueryRepository } from '../repositories/session.query.repository';
import { SessionOutputDto } from '../mappers/session.output.mapper';

export const securityDeviceGetListHandler = async (req: Request, res: Response) => {
  const { userId } = req.session;

  const sessions: SessionOutputDto[] = await sessionQueryRepository.getUserSessions(userId);

  res.status(HttpStatuses.Ok).send(sessions);
};
