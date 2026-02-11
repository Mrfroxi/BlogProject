import { Session } from '../types/session';
import { sessionsCollection } from '../../../db/mongo.db';
import { WithId } from 'mongodb';
import { mapSessionsArray } from '../mappers/session.output.mapper';
import { ISession } from '../dto/verifyRefToken.dto';
import { mapRefreshTokenSession } from '../mappers/tokenPayload.mapper';

export const sessionQueryRepository = {
  getUserSessions: async (userId: string) => {
    const result: WithId<Session>[] = await sessionsCollection.find({ userId }).toArray();

    return mapSessionsArray(result);
  },

  findSessionByRefToken: async (payload: ISession) => {
    const result = await sessionsCollection.findOne({
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
