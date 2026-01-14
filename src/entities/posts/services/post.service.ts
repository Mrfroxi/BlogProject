import {postsRepository} from "../repositories/posts.repository";
import {postCreateDto} from "../dto/post-create.input";
import {Post} from "../types/post";
import {postUpdateDto} from "../dto/post-update.input";
import {blogService} from "../../blogs/services/blog.service";
import {WithId} from "mongodb";
import { Blog } from "../../blogs/types/blog";
import {PostOutput} from "../dto/post.output";
import {ResultStatus} from "../../../core/result/resultCode";
import {ResultType} from "../../../core/result/result.type";

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

    }

}