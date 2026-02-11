import { WithId } from 'mongodb';
import { Session } from '../types/session';

export type SessionOutputDto = {
  title: string;
  ip: string;
  lastActiveDate: string;
  deviceId: string;
};

export const mapSession = (dto: WithId<Session>): SessionOutputDto => ({
  title: dto.deviceName,
  ip: dto.ip,
  lastActiveDate: `${new Date(dto.iat * 1000).toISOString()}`,
  deviceId: dto.deviceId,
});

export const mapSessionsArray = (dtos: WithId<Session>[]): SessionOutputDto[] => {
  return dtos.map(mapSession);
};
