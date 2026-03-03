import mongoose, { Document, Schema } from 'mongoose';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export interface ILikes extends Document {
  commentId: string;
  userId: string;
  status: LikeStatus;
  createdAt: Date;
}

const likeSchema = new Schema<ILikes>({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  status: {
    type: String,
    enum: [LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike],
    default: LikeStatus.None,
  },
  createdAt: { type: Date, default: () => new Date() },
});

likeSchema.index({ commentId: 1, userId: 1 }, { unique: true });
likeSchema.index({ commentId: 1, status: 1 }); //for search

export const LikeModel = mongoose.model<ILikes>('Like', likeSchema);
