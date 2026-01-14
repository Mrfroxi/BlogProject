import {Comment} from "../types/comment";
import {commentCollection} from "../../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {CommentDeleteInputDto} from "../dto/comment-delete-input.dto";


export const commentRepository = {

    findById: async (commentId:string) => {

        return commentCollection.findOne({_id: new ObjectId(commentId)})

    },

    createComment: async (commentDto:Comment)=>{

        const createdComment =  await commentCollection.insertOne(commentDto)


        return { ...commentDto , _id :createdComment.insertedId}

    },

    deleteComment : async (commentId:string) :Promise<boolean> => {
        const isDelete = await commentCollection.deleteOne({
            _id:new ObjectId(commentId),
        })

        return isDelete.deletedCount === 1;
    },

    isCommentOwner : async (dto:CommentDeleteInputDto):Promise<boolean> => {

        const comment = await commentCollection.findOne({
            _id: new ObjectId(dto.commentId),
            ["commentatorInfo.userId"]: dto.userId,
        });

        return !!comment;
    },

    updateCommentContent: async (commentId: string, content: string): Promise<WithId<Comment> | null> => {
        return  commentCollection.findOneAndUpdate(
            { _id: new ObjectId(commentId) },
            { $set: { content, updatedAt: new Date().toISOString() } },
            { returnDocument: 'after' }
        );

    },


}