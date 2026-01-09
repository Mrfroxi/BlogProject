import blogsRepository from "../repositories/blogs.repository";
import {BlogQueryInput} from "../dto/blog-query-input";


export const blogService = {

    async findAll(querySetup:BlogQueryInput){
        return  await blogsRepository.findAll(querySetup);
    }
}