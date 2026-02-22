import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true, index: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const PostModel = mongoose.model<IPost>('Post', postSchema);
