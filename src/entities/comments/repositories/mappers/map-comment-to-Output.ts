import { CommentOutputDto } from '../../dto/comment-outPut.dto';
import { IComment } from '../../../../db/schemas/comment.schema';
import { LikeStatus } from '../../../../db/schemas/likes.shema';

interface MapCommentToOutputOptions {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export const mapCommentToOutput = async (
  comment: IComment,
  options?: MapCommentToOutputOptions
): Promise<CommentOutputDto> => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: options?.likesCount ?? comment.likesCount ?? 0,
      dislikesCount: options?.dislikesCount ?? comment.dislikesCount ?? 0,
      myStatus: options?.myStatus ?? LikeStatus.None,
    },
  };
};
