import {WithId} from "mongodb";
import {Comment} from "../../types/comment";
import {CommentOutputDto} from "../../types/comment-outPut.dto";



export  const mapCommentToOutput = async (comment:WithId<Comment>):Promise<CommentOutputDto> => {


    return {
        id: comment._id.toString(),
        content:comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt:comment.createdAt,
    }

}