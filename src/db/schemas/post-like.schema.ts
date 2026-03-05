import mongoose, { Document, Schema, Types } from 'mongoose';

export enum PostLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export interface IPostLike extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  status: PostLikeStatus;
  createdAt: Date;
}

const postLikeSchema = new Schema<IPostLike>({
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  status: {
    type: String,
    enum: [PostLikeStatus.None, PostLikeStatus.Like, PostLikeStatus.Dislike],
    default: PostLikeStatus.None,
  },
  createdAt: { type: Date, default: () => new Date() },
});

postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
postLikeSchema.index({ postId: 1, status: 1 });

export const PostLikeModel = mongoose.model<IPostLike>('PostLike', postLikeSchema);
