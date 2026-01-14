import {commentRepository} from "../repositories/commentRepository";
import {CommentCreateDto} from "../repositories/dto/comment-create.dto";
import {ResultType} from "../../../core/result/result.type";
import {UserOutputDto} from "../../user/dto/user-output.dto";
import {userService} from "../../user/services/user.service";
import {PostOutput} from "../../posts/dto/post.output";
import {postService} from "../../posts/services/post.service";
import {Comment} from "../types/comment";
import {ResultStatus} from "../../../core/result/resultCode";
import {WithId} from "mongodb";
import {mapCommentToOutput} from "../repositories/mappers/map-comment-to-Output";
import {CommentOutputDto} from "../types/comment-outPut.dto";


export const commentService = {

    createComment: async (dto:CommentCreateDto) : Promise<ResultType<CommentOutputDto|null>> =>{

        const {userId,postId,content} = dto

        const userResult:ResultType<UserOutputDto | null> =  await userService.findUserById(userId);

        if(!userResult.data){
            return {
                    status: ResultStatus.NotFound,
                    data: null,
                    extensions: [{ field: 'userId', message: ' userId Not Found' }],
                    errorMessage:'userId Not Found'
            };
        }

        const postResult:ResultType<PostOutput|null> = await  postService.findPostById(postId)

        if(!postResult.data){
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: [{ field: 'post', message: ' post Not Found' }],
                errorMessage:'post Not Found'
            };
        }

        const commentDto:Comment = {
            content:content,
            postId:postId,
            commentatorInfo:{
                userId: userResult.data?.id! ,
                userLogin: userResult.data?.login! ,
            },
            createdAt: `${new Date().toISOString()}`,
        }

        const commented:WithId<Comment> = await commentRepository.createComment(commentDto)


        const outPutData:CommentOutputDto = await mapCommentToOutput(commented);


        return {
                status: ResultStatus.Success,
                data: outPutData,
                extensions: [{ field: ' ', message: ' ' }],
        };
    },




}