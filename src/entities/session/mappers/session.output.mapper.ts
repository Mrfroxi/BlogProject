import { WithId } from 'mongodb';
import { Session } from '../types/session';

export type SessionOutputDto = {
  id: string;
  userId: string;
  deviceName: string;
  ip: string;
  iat: number;
  exp: number;
  deviceId: string;
};

export const mapSession = (dto: WithId<Session>): SessionOutputDto => ({
  id: dto._id.toString(),
  userId: dto.userId,
  deviceName: dto.deviceName,
  ip: dto.ip,
  iat: dto.iat,
  exp: dto.exp,
  deviceId: dto.deviceId,
});
