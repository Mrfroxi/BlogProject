import blogsRepository from "../repositories/blogs.repository";
import {BlogQueryInput} from "../dto/blog-query-input";
import {WithId} from "mongodb";
import {Blog} from "../types/blog";

import {RepositoryNotFoundError} from "../../core/errors/repository-not-found";


export const blogService = {

    async findAll(querySetup:BlogQueryInput){
        return  await blogsRepository.findAll(querySetup);
    },

    async findById (blogId:string){
        const blog:WithId<Blog> | null= await  blogsRepository.findById(blogId);

        if(blog){
            return blog
        }else{
            throw new RepositoryNotFoundError('Driver not exist');
        }

    }
}