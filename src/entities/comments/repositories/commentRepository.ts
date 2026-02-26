import { Comment } from '../types/comment';
import { CommentModel, IComment } from '../../../db/schemas/comment.schema';
import { CommentDeleteInputDto } from '../dto/comment-delete-input.dto';
import { injectable } from 'inversify';

@injectable()
export class CommentRepository {
  async findById(commentId: string) {
    return CommentModel.findById(commentId);
  }

  async createComment(commentDto: Comment) {
    return CommentModel.create(commentDto);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const isDelete = await CommentModel.deleteOne({
      _id: commentId,
    });

    return isDelete.deletedCount === 1;
  }

  async isCommentOwner(dto: CommentDeleteInputDto): Promise<boolean> {
    const comment = await CommentModel.findOne({
      _id: dto.commentId,
      'commentatorInfo.userId': dto.userId,
    });

    return !!comment;
  }

  async updateCommentContent(
    commentId: string,
    content: string
  ): Promise<IComment | null> {
    await CommentModel.updateOne(
      { _id: commentId },
      { $set: { content } }
    );
    return CommentModel.findById(commentId);
  }
}
