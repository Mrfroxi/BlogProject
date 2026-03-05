import { ILikes, LikeModel, LikeStatus } from '../../../db/schemas/likes.shema';
import { injectable } from 'inversify';

@injectable()
export class LikeRepository {
  async findLikeByCommentAndUser(commentId: string, userId: string): Promise<ILikes | null> {
    return LikeModel.findOne({ commentId, userId });
  }

  async setLikeStatus(commentId: string, userId: string, status: LikeStatus): Promise<ILikes> {
    return LikeModel.findOneAndUpdate(
      { commentId, userId },
      { commentId, userId, status, createdAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async deleteLike(commentId: string, userId: string): Promise<boolean> {
    const result = await LikeModel.deleteOne({ commentId, userId });
    return result.deletedCount === 1;
  }

  async getLikesInfo(commentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
    const result = await LikeModel.aggregate([
      { $match: { commentId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const likesCount = result.find((elem) => elem._id === LikeStatus.Like)?.count || 0;
    const dislikesCount = result.find((elem) => elem._id === LikeStatus.Dislike)?.count || 0;

    return { likesCount, dislikesCount };
  }

  async getUserLikeStatus(commentId: string, userId: string): Promise<LikeStatus> {
    const like = await LikeModel.findOne({ commentId, userId });
    return like ? like.status : LikeStatus.None;
  }
}
