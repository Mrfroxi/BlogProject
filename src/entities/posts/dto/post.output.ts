import { PostLikeStatus } from '../../../db/schemas/post-like.schema';

interface extendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: PostLikeStatus;
  newestLikes: Array<{
    addedAt: string;
    userId: string;
    login: string;
  }>;
}

export interface PostOutput {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: extendedLikesInfo;
}
