import { sessionsCollection } from '../../../db/mongo.db';
import { Session } from '../types/session';
import { InsertOneResult } from 'mongodb';

export const sessionRepository = {
  createSession: async (payload: Session) => {
    const result: InsertOneResult<Session> = await sessionsCollection.insertOne(payload);

    return result.acknowledged;
  },
};
