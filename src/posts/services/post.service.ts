import {postsRepository} from "../repositories/posts.repository";
import {postCreateDto} from "../dto/post-create.input";
import {Post} from "../types/post";
import {postUpdateDto} from "../dto/post-update.input";
import {blogService} from "../../blogs/services/blog.service";
import {WithId} from "mongodb";
import { Blog } from "../../blogs/types/blog";

export const postService = {


    async findAll(querySetup:any){
        return  postsRepository.findAll(querySetup);
    },

    async findPostById(postId:string) {
        return postsRepository.findById(postId)
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