import { PostLikeModel, IPostLike, PostLikeStatus } from '../../../db/schemas/post-like.schema';
import mongoose from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class PostLikeRepository {
  async setLikeStatus(postId: string, userId: string, status: PostLikeStatus): Promise<IPostLike> {
    return PostLikeModel.findOneAndUpdate(
      { postId: new mongoose.Types.ObjectId(postId), userId: new mongoose.Types.ObjectId(userId) },
      { postId: new mongoose.Types.ObjectId(postId), userId: new mongoose.Types.ObjectId(userId), status, createdAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async getLikesInfo(postId: string): Promise<{ likesCount: number; dislikesCount: number }> {
    const result = await PostLikeModel.aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(postId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const likesCount = result.find((r) => r._id === PostLikeStatus.Like)?.count || 0;
    const dislikesCount = result.find((r) => r._id === PostLikeStatus.Dislike)?.count || 0;

    return { likesCount, dislikesCount };
  }

  async getMyStatus(postId: string, userId: string): Promise<PostLikeStatus> {
    const like = await PostLikeModel.findOne({ postId: new mongoose.Types.ObjectId(postId), userId: new mongoose.Types.ObjectId(userId) });
    return like ? like.status : PostLikeStatus.None;
  }

  async getNewestLikes(postId: string): Promise<Array<{ addedAt: string; userId: string; login: string }>> {
    const likes = await PostLikeModel.aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(postId), status: PostLikeStatus.Like } },
      { $sort: { createdAt: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 0,
          addedAt: { $toString: '$createdAt' },
          userId: { $toString: '$userId' },
          login: '$user.login',
        },
      },
    ]);

    return likes;
  }

  async updateLikesCounters(postId: string, likesCount: number, dislikesCount: number): Promise<void> {
    const { PostModel } = await import('../../../db/schemas/post.schema');
    await PostModel.updateOne(
      { _id: new mongoose.Types.ObjectId(postId) },
      { $set: { likesCount, dislikesCount } }
    );
  }
}
