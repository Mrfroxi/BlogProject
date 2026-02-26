import { CommentOutputDto } from '../../dto/comment-outPut.dto';
import { IComment } from '../../../../db/schemas/comment.schema';

export const mapCommentToOutput = async (comment: IComment): Promise<CommentOutputDto> => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
  };
};
