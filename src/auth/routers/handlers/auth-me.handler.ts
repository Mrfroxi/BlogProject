import { Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { userQueryRepository } from '../../../entities/user/repositories/user-query.repository';
import { UserAuthMeOutputDto } from '../../../entities/user/dto/userAuthMe-output.dto';

export const authMeHandler = async (req: Request, res: Response) => {
  const userId: string | null = req.userId;

  const userData: UserAuthMeOutputDto | null = await userQueryRepository.AuthMeById(userId!);

  if (!userData) {
    res.sendStatus(HttpStatuses.Unauthorized);
  }

  res.status(HttpStatuses.Ok).send(userData);
};
