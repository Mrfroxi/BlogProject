import mongoose, { Schema, Document } from 'mongoose';
import { SETTINGS } from '../../core/setting/settings';

export interface IRateLimit extends Document {
  ip: string;
  url: string;
  date: Date;
}

const rateLimitSchema = new Schema<IRateLimit>(
  {
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

rateLimitSchema.index(
  { date: 1 },
  { expireAfterSeconds: Number(SETTINGS.WINDOW_TIME_DELAY) / 1000 }
);

export const RateLimitModel = mongoose.model<IRateLimit>('RateLimit', rateLimitSchema);
