import {postsRepository} from "../repositories/posts.repository";
import {postCreateDto} from "../dto/post-create.input";
import {Post} from "../types/post";
import {postUpdateDto} from "../dto/post-update.input";
import {blogService} from "../../blogs/services/blog.service";
import {ObjectId, WithId} from "mongodb";
import { Blog } from "../../blogs/types/blog";
import {PostOutput} from "../dto/post.output";
import {ResultStatus} from "../../../core/result/resultCode";
import {ResultType} from "../../../core/result/result.type";
import {PostQueryInput} from "../dto/post-query-input";
import {PostSortField} from "../types/post-sort-fields";
import {commentCollection, postCollection, userCollection} from "../../../db/mongo.db";
import {UserOutputDto} from "../../user/dto/user-output.dto";
import {mapUserListToOutput} from "../../user/repositories/mappers/map-user-list-to-output";

export const postService = {


    async findAll(querySetup:any){
        return  postsRepository.findAll(querySetup);
    },

    async findPostById(postId:string):Promise<ResultType<PostOutput|null>>{

        const postResult:PostOutput|null =  await postsRepository.findById(postId);

        if(!postResult){
            return  {
                    status:ResultStatus.NotFound ,
                    data: null,
                    extensions: [{ field: 'postId', message: 'Post Not Found' }],
                    errorMessage: 'Post Not Found'
            };
        }

        return {
                status: ResultStatus.Success,
                data: postResult,
                extensions: [{ field: ' ', message: ' ' }],
        };

    },

    async createPost(dto:postCreateDto){

        const blog:WithId<Blog> = await blogService.findById(dto.blogId)

        const   createPostDto : Post = {
            blogId: dto.blogId ,
            blogName: blog.name,
            content: dto.content ?? "Default content",
            createdAt: `${new Date().toISOString()}`,
            shortDescription: dto.shortDescription ?? "Default shortDescription",
            title: dto.title ?? "Default Title"

        }

        return  postsRepository.createPost(createPostDto)

    },

    async updatePost(postId:string,reqBody:postUpdateDto){
        return postsRepository.updatePost(postId,reqBody)
    },

    async deletePost(postId:string){
        return postsRepository.deletePost(postId);

    },

    async findAllComments(query:any) {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            postId,
        } = query;

        const skip = (pageNumber - 1) * pageSize;

        const filter = { postId };

        const comments = await commentCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await commentCollection.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const mappedItems = comments.map(c => ({
            id: c._id.toString(),
            content: c.content,
            commentatorInfo: c.commentatorInfo,
            createdAt: c.createdAt,
        }));

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedItems,
        };
    }


}
