import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
}

const commentatorInfoSchema = new Schema(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true, index: true },
    commentatorInfo: { type: commentatorInfoSchema, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const CommentModel = mongoose.model<IComment>('Comment', commentSchema);
