import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../../core/services/jwt.service';

export const JwtOptionalAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    req.userId = null;
    return next();
  }

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') {
    req.userId = null;
    return next();
  }

  const payload = await jwtService.verifyAuthToken(token);

  if (payload.data) {
    const { id } = payload.data;
    req.userId = id;
  } else {
    req.userId = null;
  }

  next();
};
