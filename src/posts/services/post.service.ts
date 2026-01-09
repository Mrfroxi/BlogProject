import {postsRepository} from "../repositories/posts.repository";
import {postCreateDto} from "../dto/post-create.input";
import {Post} from "../types/post";
import {postUpdateDto} from "../dto/post-update.input";

export const postService = {

    async findPostById(postId:string) {
        return postsRepository.findById(postId)
    },

    async createPost(dto:postCreateDto){
        const   createPostDto : Post = {
            blogId: dto.blogId,
            blogName: "string",
            content: dto.content,
            createdAt: `${new Date().toISOString()}`,
            shortDescription: dto.shortDescription,
            title: dto.title

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