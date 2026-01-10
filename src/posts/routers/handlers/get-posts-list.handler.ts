import {Response,Request} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {matchedData} from "express-validator";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {PostQueryInput} from "../../dto/post-query-input";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helper/set-default-sort-and-pagination";
import {postService} from "../../services/post.service";
import {mapPostListToOutput} from "../mappers/map-posts-list-to-output";
import {PostSortField} from "../../types/post-sort-fields";

export const getPostListHandler = async (req:Request,res:Response) =>{

    try{
        const sanitizedQuery = matchedData<PostQueryInput<PostSortField>>(req, {
            locations: ['query'],
            includeOptionals: false,//include optional fields even if they are not sent
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist<PostSortField>(sanitizedQuery);

        const {items, totalCount} = await postService.findAll(queryInput);

        const blogListOutput = mapPostListToOutput(items,
            {
                totalCount,
                pageNumber:queryInput.pageNumber,
                pageSize:queryInput.pageSize,
            }
        )

        res.status(HttpStatuses.Ok).send(blogListOutput);


    }catch (e:unknown){
        errorHandler(e,res)
    }


}