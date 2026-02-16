import crypto from 'crypto';
import { Request } from 'express';
import { normalizeIp } from '../../../core/helper/normalizeIp';

export type RequestInfo = {
  userAgent: string;
  ip: string;
  deviceId: string;
};

export const getRequestInfo = async (req: Request) => {
  const userAgent: string = req.headers['user-agent'] || 'bad user-agent';

  const ip: string = normalizeIp(
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || req.ip
  );

  const deviceId: string = crypto.randomUUID();

  return { userAgent, ip, deviceId };
};
