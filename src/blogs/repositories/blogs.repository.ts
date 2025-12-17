import {db} from "../../db/in-memory.db";
import {BlogCreateInput} from "../dto/blog-create.input";
import {Blog} from "../types/blog";
import {BlogUpdateDto} from "../dto/blog-update";


export const blogsRepository = {
    findAll: () =>{
        return db.blogs;
    },
    findById: (id:number) => {

        return  db.blogs.find((elem:Blog)=> +elem.id === id ) ?? null;
    },
    findIndexById(id:number){
        return  db.blogs.findIndex((elem:Blog)=> +elem.id === id );
    },
    createBlog(blog:BlogCreateInput){

        const newBlog:Blog = {
            id: `${db.blogs.length+1}` ,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        }

        db.blogs.push(newBlog)

        return newBlog;
    },
    updateBlog(id:string,body:BlogUpdateDto){

        const blog:Blog | null = blogsRepository.findById(+id)

        if (!blog) {
            return blog;
        }

        blog.name = body.name
        blog.description = body.description
        blog.websiteUrl = body.websiteUrl

        return blog;
    },
    deleteBlog(id:string){

        const deletedBlogIndex:number = blogsRepository.findIndexById(+id);

        if(deletedBlogIndex === -1) {
            return null
        }

        db.blogs.splice(deletedBlogIndex, 1);

        return deletedBlogIndex

    }
}