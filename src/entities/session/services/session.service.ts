import { Request } from 'express';
import { jwtService } from '../../../core/services/jwt.service';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { Session } from '../types/session';
import { sessionRepository } from '../repositories/session.repository';
import { SessionTokens } from '../dto/setSession.output.dto';
import { ResultType } from '../../../core/object-result/result.type';
import { ISession } from '../dto/verifyRefToken.dto';
import { SessionOutputDto } from '../mappers/session.output.mapper';
import { getRequestInfo } from '../helpers/getRequestInfo';

export const sessionService = {
  setSession: async (
    request: Request,
    userId: string
  ): Promise<ResultType<SessionTokens | null>> => {
    const { userAgent, ip, deviceId } = await getRequestInfo(request);

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

  verifySession: async (payload: ISession) => {
    const foundSession: SessionOutputDto | null =
      await sessionRepository.findSessionByRefToken(payload);

    if (!foundSession) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'foundSession', message: 'foundSession is wrong' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: foundSession,
      extensions: [{ field: '', message: '' }],
    };
  },

  updateSession: async (request: Request) => {
    const refreshToken = request.cookies.refreshToken;

    const { id, deviceId, iat, exp } = await jwtService.decodeToken(refreshToken);

    const updatedSessionToken: SessionTokens | null = await sessionRepository.updateSession({
      id,
      deviceId,
      iat,
      exp,
    });

    if (!updatedSessionToken) {
      return {
        status: ResultStatus.InternalServerError,
        data: null,
        extensions: [{ field: 'updatedSessionToken', message: 'updatedSessionToken is bad' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: updatedSessionToken,
      extensions: [{ field: ' ', message: ' ' }],
    };
  },

  resetToken: async (payload: ISession) => {
    const resetToken = await sessionRepository.logOut(payload);

    if (!resetToken) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: ' ', message: ' ' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: ' ', message: ' ' }],
    };
  },
};
