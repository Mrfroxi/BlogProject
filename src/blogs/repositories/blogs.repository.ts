import {db} from "../../db/in-memory.db";


export const blogsRepository = {
    findAll: () =>{
        return db.blogs;
    },
    findById: (id:number) => {

        return  db.blogs.find((elem)=> elem.id === id ) ?? null;
    }
}