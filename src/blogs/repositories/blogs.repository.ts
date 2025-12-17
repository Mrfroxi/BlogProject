import {db} from "../../db/in-memory.db";
import {BlogCreateInput} from "../dto/blog-create.input";
import {Blog} from "../types/blog";


export const blogsRepository = {
    findAll: () =>{
        return db.blogs;
    },
    findById: (id:number) => {

        return  db.blogs.find((elem)=> elem.id === id ) ?? null;
    },
    createBlog(blog:BlogCreateInput){

        const newBlog:Blog = {
            id: db.blogs.length+1 ,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        }

        db.blogs.push(newBlog)

        return newBlog;
    }
}