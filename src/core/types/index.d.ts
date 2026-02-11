import 'express';
import { RefreshTokenSessionDto } from '../../entities/session/mappers/tokenPayload.mapper';

declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
      session: RefreshTokenSessionDto;
    }
  }
}
