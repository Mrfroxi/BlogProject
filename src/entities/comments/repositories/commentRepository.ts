import {Comment} from "../types/comment";
import {commentCollection} from "../../../db/mongo.db";


export const commentRepository = {

    createComment: async (commentDto:Comment)=>{

        const createdComment =  await commentCollection.insertOne(commentDto)


        return { ...commentDto , _id :createdComment.insertedId}

    }

}