import jwt, { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from '../setting/settings';
import { ResultStatus } from '../object-result/resultCode';
import { ResultType } from '../object-result/result.type';
import { sessionService } from '../../entities/session/services/session.service';
import { ISession } from '../../entities/session/dto/verifyRefToken.dto';
import { RefreshTokenSessionDto } from '../../entities/session/mappers/tokenPayload.mapper';

interface generateUserTokenDto {
  id: string;
  deviceId: string;
}

export const jwtService = {
  generateAuthUserToken: async (dto: generateUserTokenDto) => {
    return jwt.sign({ id: dto.id, deviceId: dto.deviceId }, SETTINGS.JWT_AUTH_SECRET, {
      expiresIn: SETTINGS.EXPIRES_AUTH as jwt.SignOptions['expiresIn'],
    });
  },

  generateRefreshUserToken: async (dto: generateUserTokenDto) => {
    return jwt.sign({ id: dto.id, deviceId: dto.deviceId }, SETTINGS.JWT_REFRESH_SECRET, {
      expiresIn: SETTINGS.EXPIRES_REFRESH as jwt.SignOptions['expiresIn'],
    });
  },

  verifyAuthToken: async (token: string): Promise<ResultType<JwtPayload | null>> => {
    //time
    return new Promise((resolve) => {
      jwt.verify(token, SETTINGS.JWT_AUTH_SECRET, (err, decoded) => {
        if (err || !decoded) {
          resolve({
            status: ResultStatus.Unauthorized,
            data: null,
            extensions: [{ field: 'verifiedToken', message: 'JWT is invalid or expired.' }],
          });
        } else {
          resolve({
            status: ResultStatus.Success,
            data: decoded as JwtPayload & { id: string },
            extensions: [{ field: ' ', message: ' ' }],
          });
        }
      });
    });
  },

  verifyRefreshToken: async (token: string): Promise<ResultType<RefreshTokenSessionDto | null>> => {
    //time
    const verifiedTokenByExpired = await new Promise<JwtPayload | null>((resolve) => {
      jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err || !decoded) return resolve(null);
        resolve(decoded as JwtPayload);
      });
    });

    if (!verifiedTokenByExpired) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'verifiedTokenByExpired', message: ' token not verified.' }],
      };
    }

    const { id, deviceId, iat, exp } = verifiedTokenByExpired;

    const verifiedToken = await sessionService.verifySession({
      id,
      deviceId,
      iat,
      exp,
    });

    if (verifiedToken.data) {
      return {
        status: ResultStatus.Success,
        data: verifiedToken.data,
        extensions: [{ field: '', message: '' }],
      };
    }

    return {
      status: ResultStatus.Unauthorized,
      data: null,
      extensions: [{ field: 'verifiedTokenByBlackList', message: 'token blackList' }],
    };
  },

  async decodeToken(token: string): Promise<JwtPayload> {
    return jwt.decode(token) as ISession;
  },
};
