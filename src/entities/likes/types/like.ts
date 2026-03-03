import { LikeStatus } from '../../../db/schemas/likes.shema';

export type Like = {
  commentId: string;
  userId: string;
  status: LikeStatus;
  createdAt: Date;
};
