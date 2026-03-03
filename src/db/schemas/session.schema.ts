import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: number;
  exp: number;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: String, required: true, index: true },
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    ip: { type: String, required: true },
    iat: { type: Number, required: true },
    exp: { type: Number, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

sessionSchema.index({ userId: 1, deviceId: 1, iat: 1 });

export const SessionModel = mongoose.model<ISession>('Session', sessionSchema);
