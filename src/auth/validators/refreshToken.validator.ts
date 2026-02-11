import { Request, Response, NextFunction } from 'express';
import { HttpStatuses } from '../../core/types/http-statuses';
import { ResultType } from '../../core/object-result/result.type';
import { jwtService } from '../../core/services/jwt.service';
import { RefreshTokenSessionDto } from '../../entities/session/mappers/tokenPayload.mapper';

export const refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  const verifyToken: ResultType<RefreshTokenSessionDto | null> =
    await jwtService.verifyRefreshToken(refreshToken);

  if (!verifyToken.data) {
    res.sendStatus(HttpStatuses.Unauthorized);
    return;
  }

  req.session = verifyToken.data;
  next();
};
