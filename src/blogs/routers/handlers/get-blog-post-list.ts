import {Request, Response} from "express";
import {blogService} from "../../services/blog.service";
import {postService} from "../../../posts/services/post.service";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {matchedData} from "express-validator";
import {PostQueryInput} from "../../../posts/dto/post-query-input";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helper/set-default-sort-and-pagination";
import {PostSortField} from "../../../posts/types/post-sort-fields";
import {mapPostListToOutput} from "../../../posts/routers/mappers/map-posts-list-to-output";

export const  getBlogPostListHandler =  async (req:Request,res:Response) =>{
    try {
        const blogId = req.params.id;
        const sanitizedQuery = matchedData<PostQueryInput<PostSortField>>(req, {
            locations: ['query','params'],
            includeOptionals: true,//include optional fields even if they are not sent
        });

        await blogService.findById(blogId);

        const queryInput = setDefaultSortAndPaginationIfNotExist<PostSortField>(sanitizedQuery);

        const {items,totalCount} = await postService.findAll(queryInput)

        res.status(HttpStatuses.Ok).send(mapPostListToOutput(items,{
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount
        }))
    }catch (e:unknown){
        errorHandler(e,res)
    }

}