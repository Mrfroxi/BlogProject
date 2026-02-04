import jwt, { JwtPayload } from 'jsonwebtoken';
import { refreshTokenBlackListRepository } from './refreshToken-BlackList.repository';
import { ResultStatus } from '../../core/object-result/resultCode';
import { ResultType } from '../../core/object-result/result.type';
import { SETTINGS } from '../../core/setting/settings';
import { jwtService } from '../../core/services/jwt.service';

export const refreshTokenBlackListService = {
  isTokenBlacklisted: async (
    JwtPayload: JwtPayload,
    token: string
  ): Promise<ResultType<boolean | null>> => {
    const { id } = JwtPayload;

    const validUser: ResultType<null | boolean> =
      await refreshTokenBlackListRepository.findTokensByUserId(id, token);

    if (!validUser.data) {
      //found user token in the black list array
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'validUser', message: 'validUser dont have this refresh token' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: validUser.data,
      extensions: [{ field: '', message: '' }],
    };
  },

  refreshTokens: async (
    token: string
  ): Promise<ResultType<null | { accessToken: string; refreshToken: string }>> => {
    const { id }: JwtPayload = jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET) as { id: string };

    const addedTokenToBlackList: boolean = await refreshTokenBlackListRepository.addInvalidToken(
      token,
      id
    );

    if (!addedTokenToBlackList) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [{ field: 'addedTokenToBlackList', message: 'problem with update blackList' }],
      };
    }

    const accessToken: string = await jwtService.generateAuthUserToken({ id });

    const refreshToken: string = await jwtService.generateRefreshUserToken({ id });

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },
};
