import { Request, Response, NextFunction } from 'express';
import { rateLimitsCollection } from '../../../db/mongo.db';
import { SETTINGS } from '../../../core/setting/settings';
import { normalizeIp } from '../../../core/helper/normalizeIp';
import { HttpStatuses } from '../../../core/types/http-statuses';

const WINDOW_MS = Number(SETTINGS.WINDOW_TIME_DELAY);
const LIMIT = Number(SETTINGS.LIMIT_REQUESTS);

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = normalizeIp(
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        req.ip
    );

    const url = req.originalUrl;

    const now = new Date();
    const fromDate = new Date(now.getTime() - WINDOW_MS);

    const requestsCount = await rateLimitsCollection.countDocuments({
      ip: ip,
      url: url,
      date: { $gte: fromDate },
    });

    if (requestsCount >= LIMIT) {
      return res.sendStatus(HttpStatuses.TooManyRequests);
    }

    await rateLimitsCollection.insertOne({
      ip: ip,
      url: url,
      date: now,
    });

    next();
  } catch (e) {
    console.error('Rate limit error:', e);
    next(e);
  }
}
