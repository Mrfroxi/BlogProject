import {commentRepository} from "../repositories/commentRepository";
import {CommentCreateDto} from "../dto/comment-create.dto";
import {ResultType} from "../../../core/result/result.type";
import {UserOutputDto} from "../../user/dto/user-output.dto";
import {userService} from "../../user/services/user.service";
import {PostOutput} from "../../posts/dto/post.output";
import {postService} from "../../posts/services/post.service";
import {Comment} from "../types/comment";
import {ResultStatus} from "../../../core/result/resultCode";
import {ObjectId, WithId} from "mongodb";
import {mapCommentToOutput} from "../repositories/mappers/map-comment-to-Output";
import {CommentOutputDto} from "../dto/comment-outPut.dto";
import {CommentDeleteInputDto} from "../dto/comment-delete-input.dto";


export const commentService = {

    findById: async (commentId:string):Promise<ResultType<CommentOutputDto|null>> => {
        const comment = await commentRepository.findById(commentId)

        if(!comment){
            return {
                    status: ResultStatus.NotFound,
                    data: null,
                    extensions: [{ field: 'commentId', message: ' Not Found commentId' }],

        };
        }

        const outPutData:CommentOutputDto = await mapCommentToOutput(comment);
        return {
                status: ResultStatus.Success,
                data: outPutData,
                extensions: [{ field: ' ', message: ' ' }],
        };
    },

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

    deleteComment :  async function(dto:CommentDeleteInputDto):Promise<ResultType<boolean|null>>{

        const {userId,commentId } = dto

        const comment = await  commentRepository.findById(commentId)

        if(!comment){
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: [{ field: 'commentId', message: 'Not found comment' }],
            };
        }

        const isOwner = await commentRepository.isCommentOwner(dto);

        if(!isOwner){
            return {
                    status: ResultStatus.Forbidden,
                    data: null,
                    extensions: [{ field: 'userId', message: 'Forbidden' }],
            };
        }

        const deleteComment = await commentRepository.deleteComment(commentId)

        if(!deleteComment){
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'deleted', message: 'deleted' }],
            };
        }

        return {
                status: ResultStatus.Success,
                data: true,
                extensions: [{ field: ' ', message: ' ' }],
        };

    },

    updateComment: async function(dto: { commentId: string; userId: string; content: string }): Promise<ResultType<CommentOutputDto | null>> {
        const { commentId, userId, content } = dto;

        const comment = await commentRepository.findById(commentId);

        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: [{ field: 'commentId', message: 'Comment not found' }],
            };
        }

        const isOwner = await commentRepository.isCommentOwner({ commentId, userId });

        if (!isOwner) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                extensions: [{ field: 'userId', message: 'Forbidden: not the owner' }],
            };
        }

        const updatedComment = await commentRepository.updateCommentContent(commentId, content);

        if (!updatedComment) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'content', message: 'Failed to update comment' }],
            };
        }

        const outPutData: CommentOutputDto = await mapCommentToOutput(updatedComment);

        return {
            status: ResultStatus.Success,
            data: outPutData,
            extensions: [{ field: ' ', message: ' ' }],
        };
    },


}