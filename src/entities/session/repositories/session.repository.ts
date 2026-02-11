import { sessionsCollection } from '../../../db/mongo.db';
import { Session } from '../types/session';
import { InsertOneResult } from 'mongodb';
import { ISession } from '../dto/verifyRefToken.dto';
import { mapSession } from '../mappers/session.output.mapper';
import { jwtService } from '../../../core/services/jwt.service';
import { SessionTokens } from '../dto/setSession.output.dto';

export const sessionRepository = {
  createSession: async (payload: Session) => {
    const result: InsertOneResult<Session> = await sessionsCollection.insertOne(payload);

    return result.acknowledged;
  },

  findSessionByRefToken: async (payload: ISession) => {
    console.log(payload);

    const result = await sessionsCollection.findOne({
      userId: payload.id,
      deviceId: payload.deviceId,
      iat: payload.iat,
      exp: payload.exp,
    });

    if (!result) {
      return null;
    }

    return mapSession(result);
  },

  updateSession: async (payload: ISession): Promise<SessionTokens | null> => {
    //ref
    const newRefToken: string = await jwtService.generateRefreshUserToken({
      id: payload.id,
      deviceId: payload.deviceId,
    });

    const { iat, exp } = await jwtService.decodeToken(newRefToken);

    const result = await sessionsCollection.updateOne(
      { userId: payload.id, deviceId: payload.deviceId, iat: payload.iat },
      {
        $set: { iat, exp },
      }
    );

    if (!result.acknowledged) {
      return null;
    }
    //ref
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
    const result = await sessionsCollection.deleteOne({
      userId: payload.id,
      deviceId: payload.deviceId,
      iat: payload.iat,
    });

    return result.acknowledged;
  },
};
