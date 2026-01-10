import {BlogQueryInput} from "../dto/blog-query-input";
import {WithId} from "mongodb";
import {Blog} from "../types/blog";
import {BlogCreateInput} from "../dto/blog-create.input";
import {blogsRepository} from "../repositories/blogs.repository";
import {BlogUpdateDto} from "../dto/blog-update";


export const blogService = {

    async findAll(querySetup:any){
        return  blogsRepository.findAll(querySetup);
    },

    async findById (blogId:string):Promise<WithId<Blog>>{
        return  blogsRepository.findById(blogId);
    },

    async createBlog(dto:BlogCreateInput){

        const newBlog : Blog = {
            name:dto.name,
            createdAt: `${new Date().toISOString()}`,
            description: dto.description,
            isMembership: false,
            websiteUrl: dto.websiteUrl,
        }

        return await blogsRepository.createBlog(newBlog);

    },

    async updateBlog(blogId:string,reqBody:BlogUpdateDto){
      return await blogsRepository.updateBlog(blogId,reqBody)
    },

    async deleteBlog(id:string):Promise<void>{
        return  blogsRepository.deleteBlog(id)
    }

}