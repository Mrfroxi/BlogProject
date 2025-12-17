import {db} from "../../db/in-memory.db";
import {postCreateDto} from "../dto/post-create.input";
import {Post} from "../types/post";
import {postUpdateDto} from "../dto/post-update.input";


export const postsRepository = {
    getPostById : (id:number) => {
        return  db.posts.find((elem) => +elem.id === id) ?? null;
    },
    getPostsList:()=>{
        return db.posts;
    },
    findIndexById(id:number){
        return  db.posts.findIndex((elem:Post)=> +elem.id === id );
    },
    createPost: (body:postCreateDto) => {
        const newPost:Post = {
            id:`${db.posts.length +1}`,
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: '' ,
        }

        db.posts.push(newPost);

        return newPost;
    },
    updatePost : (id:string,body:postUpdateDto) => {
        const post:Post | null = postsRepository.getPostById(+id)

        if (!post) {
            return post;
        }

        post.title = body.title
        post.shortDescription = body.shortDescription
        post.content = body.content
        post.blogId = body.blogId

        return post;
    },
    deletePost: (id:string) => {
       const currentPostIndex = postsRepository.findIndexById(+id);

        if(currentPostIndex === -1) {
            return null
        }

        db.posts.splice(currentPostIndex, 1);

        return currentPostIndex
    }
}