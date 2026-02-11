import { WithId } from 'mongodb';
import { Session } from '../types/session';

export type RefreshTokenSessionDto = {
  id: string;
  userId: string;
  deviceName: string;
  ip: string;
  iat: number;
  exp: number;
  deviceId: string;
};

export const mapRefreshTokenSession = (dto: WithId<Session>): RefreshTokenSessionDto => ({
  id: dto._id.toString(),
  userId: dto.userId,
  deviceName: dto.deviceName,
  ip: dto.ip,
  iat: dto.iat,
  exp: dto.exp,
  deviceId: dto.deviceId,
});
