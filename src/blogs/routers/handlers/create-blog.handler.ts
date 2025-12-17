import {Request,Response} from "express";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";


export  function  createBlogHandler(req:Request,res:Response){

    const { body } = req;

    const blog:Blog = blogsRepository.createBlog(body);

    res.status(HttpStatuses.Created).send(blog);
}