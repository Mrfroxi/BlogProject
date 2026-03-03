import { Session } from '../types/session';
import { WithId } from 'mongodb';
import { mapSessionsArray } from '../mappers/session.output.mapper';
import { ISession } from '../dto/verifyRefToken.dto';
import { mapRefreshTokenSession } from '../mappers/tokenPayload.mapper';
import { SessionModel } from '../../../db/mongo.db';

export const sessionQueryRepository = {
  getUserSessions: async (userId: string) => {
    const result: WithId<Session>[] = await SessionModel.find({ userId });

    return mapSessionsArray(result);
  },

  findSessionByRefToken: async (payload: ISession) => {
    const result = await SessionModel.findOne({
      userId: payload.id,
      deviceId: payload.deviceId,
      iat: payload.iat,
      exp: payload.exp,
    });

    if (!result) {
      return null;
    }

    return mapRefreshTokenSession(result);
  },
};
