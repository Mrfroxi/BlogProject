import { LikeStatus } from '../../../db/schemas/likes.shema';

interface userInfo {
  userId: string;
  userLogin: string;
}

interface likesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus | null;
}

export type CommentOutputDto = {
  id: string;
  commentatorInfo: userInfo;
  content: string;
  createdAt: string;
  likesInfo: likesInfo;
};
