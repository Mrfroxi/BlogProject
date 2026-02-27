import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
}

const emailConfirmationSchema = new Schema(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, default: null },
    isConfirmed: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: { type: emailConfirmationSchema, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
