import {Router} from "express";

export const blogsRouter = Router({});


blogsRouter
    .get('', (req,res) => {
        console.log(req)
    })
