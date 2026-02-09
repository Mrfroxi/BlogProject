import jwt, { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from '../setting/settings';
import { ResultStatus } from '../object-result/resultCode';
import { ResultType } from '../object-result/result.type';

interface generateUserTokenDto {
  id: string;
  deviceId: string;
}

export const jwtService = {
  generateAuthUserToken: async (dto: generateUserTokenDto) => {
    return jwt.sign({ id: dto.id }, SETTINGS.JWT_AUTH_SECRET, {
      expiresIn: SETTINGS.EXPIRES_AUTH as jwt.SignOptions['expiresIn'],
    });
  },

  generateRefreshUserToken: async (dto: generateUserTokenDto) => {
    return jwt.sign({ id: dto.id }, SETTINGS.JWT_REFRESH_SECRET, {
      expiresIn: SETTINGS.EXPIRES_REFRESH as jwt.SignOptions['expiresIn'],
    });
  },

  verifyAuthToken: async (token: string): Promise<ResultType<JwtPayload | null>> => {
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

  verifyRefreshToken: async (token: string): Promise<JwtPayload | ResultType> => {
    //time
    const verifiedTokenByExpired = await new Promise<JwtPayload | null>((resolve) => {
      jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err || !decoded) return resolve(null);
        resolve(decoded as JwtPayload & { userId: string; login: string });
      });
    });

    if (!verifiedTokenByExpired) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'verifiedTokenByExpired', message: ' token not verified.' }],
      };
    }

    // //blackList
    // const verifiedTokenByBlackList: ResultType<boolean | null> = null;
    // // await refreshTokenBlackListService.isTokenBlacklisted(verifiedTokenByExpired, token);
    //
    // //There is no token in blackList
    // if (verifiedTokenByBlackList.data) {
    //   return {
    //     status: ResultStatus.Success,
    //     data: verifiedTokenByBlackList.data,
    //     extensions: [{ field: ' ', message: ' ' }],
    //   };
    // }

    return {
      status: ResultStatus.Unauthorized,
      data: null,
      extensions: [{ field: 'verifiedTokenByBlackList', message: 'token blackList' }],
    };
  },

  async decodeToken(token: string): Promise<JwtPayload | null> {
    return jwt.decode(token) as { iat: number; exp: number } | null;
  },
};
