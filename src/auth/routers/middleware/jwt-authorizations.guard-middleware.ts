import { NextFunction, Request, Response } from 'express';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { jwtService } from '../../../core/services/jwt.service';
import { ResultType } from '../../../core/object-result/result.type';
import { JwtPayload } from 'jsonwebtoken';

export const JwtAuthorizations = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) return res.sendStatus(HttpStatuses.Unauthorized);

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') return res.sendStatus(HttpStatuses.Unauthorized);

  const payload: ResultType<JwtPayload | null> = await jwtService.verifyAuthToken(token);

  if (payload.data) {
    const { id } = payload.data;

    req.userId = id;

    next();

    return;
  }

  res.sendStatus(HttpStatuses.Unauthorized);

  return;
};
