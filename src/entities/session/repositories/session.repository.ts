import { Session } from '../types/session';
import { ISession } from '../dto/verifyRefToken.dto';
import { jwtService } from '../../../core/services/jwt.service';
import { SessionTokens } from '../dto/setSession.output.dto';
import { SessionModel } from '../../../db/schemas/session.schema';

export const sessionRepository = {
  createSession: async (payload: Session) => {
    await SessionModel.create(payload);
    return true;
  },

  updateSession: async (payload: ISession): Promise<SessionTokens | null> => {
    const newRefToken: string = await jwtService.generateRefreshUserToken({
      id: payload.id,
      deviceId: payload.deviceId,
    });

    const { iat, exp } = await jwtService.decodeToken(newRefToken);

    const result = await SessionModel.updateOne(
      { userId: payload.id, deviceId: payload.deviceId, iat: payload.iat },
      {
        $set: { iat, exp },
      }
    );

    if (result.matchedCount === 0) {
      return null;
    }
    // ref
    const newAuthToken: string = await jwtService.generateAuthUserToken({
      id: payload.id,
      deviceId: payload.deviceId,
    });

    return {
      refreshToken: newRefToken,
      accessToken: newAuthToken,
    };
  },

  logOut: async (payload: ISession) => {
    const result = await SessionModel.deleteOne({
      userId: payload.id,
      deviceId: payload.deviceId,
      iat: payload.iat,
    });

    return result.deletedCount === 1;
  },

  deleteUserSessions: async (userId: string, deviceId: string) => {
    return SessionModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
  },

  deleteUserSessionById: async (deviceId: string, userId: string) => {
    const result = await SessionModel.deleteOne({ deviceId, userId });

    return result.deletedCount === 1;
  },

  findSessionByDeviceId: async (deviceId: string) => {
    return SessionModel.findOne({ deviceId });
  },
};
