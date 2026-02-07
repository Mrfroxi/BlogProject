import { Request } from 'express';
import { normalizeIp } from '../../../core/helper/normalizeIp';
import { jwtService } from '../../../core/services/jwt.service';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { Session } from '../types/session';
import { sessionRepository } from '../repositories/session.repository';
import { AuthTokens } from '../dto/setSession.output.dto';
import { ResultType } from '../../../core/object-result/result.type';

export const sessionService = {
  async setSession(req: Request, userId: string): Promise<ResultType<AuthTokens | null>> {
    const userAgent: string | null = req.headers['user-agent'] || null;

    const ip: string = await normalizeIp(
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.socket.remoteAddress ||
        req.ip
    );

    const deviceId: string = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      jwtService.generateAuthUserToken({ id: userId, deviceId: deviceId }),
      jwtService.generateRefreshUserToken({ id: userId, deviceId: deviceId }),
    ]);

    const decoded = await jwtService.decodeToken(refreshToken);

    if (!decoded || typeof decoded.iat !== 'number' || typeof decoded.exp !== 'number') {
      return {
        status: ResultStatus.InternalServerError,
        data: null,
        extensions: [{ field: 'decoded', message: 'decoded is wrong' }],
      };
    }

    const { iat, exp } = decoded;

    const payload: Session = {
      userId: userId,
      deviceName: userAgent,
      ip: ip,
      iat: iat,
      exp: exp,
      deviceId: deviceId,
    };

    const createdSession: boolean = await sessionRepository.createSession(payload);

    if (!createdSession) {
      return {
        status: ResultStatus.InternalServerError,
        data: null,
        extensions: [{ field: 'createdSession', message: 'createdSession is wrong' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [{ field: ' ', message: ' ' }],
    };
  },
};
