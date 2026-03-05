import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true, index: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const PostModel = mongoose.model<IPost>('Post', postSchema);
