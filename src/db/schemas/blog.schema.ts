import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

const blogSchema = new Schema<IBlog>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const BlogModel = mongoose.model<IBlog>('Blog', blogSchema);
