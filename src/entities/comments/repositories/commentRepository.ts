import { Comment } from '../types/comment';
import { commentCollection } from '../../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { CommentDeleteInputDto } from '../dto/comment-delete-input.dto';
import { injectable } from 'inversify';

@injectable()
export class CommentRepository {
  async findById(commentId: string) {
    return commentCollection.findOne({ _id: new ObjectId(commentId) });
  }

  async createComment(commentDto: Comment) {
    const createdComment = await commentCollection.insertOne(commentDto);

    return { ...commentDto, _id: createdComment.insertedId };
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const isDelete = await commentCollection.deleteOne({
      _id: new ObjectId(commentId),
    });

    return isDelete.deletedCount === 1;
  }

  async isCommentOwner(dto: CommentDeleteInputDto): Promise<boolean> {
    const comment = await commentCollection.findOne({
      _id: new ObjectId(dto.commentId),
      ['commentatorInfo.userId']: dto.userId,
    });

    return !!comment;
  }

  async updateCommentContent(
    commentId: string,
    content: string
  ): Promise<WithId<Comment> | null> {
    return commentCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
  }
}
