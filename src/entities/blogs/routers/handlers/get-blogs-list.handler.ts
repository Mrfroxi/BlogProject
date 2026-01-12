import { Request, Response } from 'express';
import {matchedData} from "express-validator";;
import {mapBlogsListToOutput} from "../mappers/map-blogs-list-to-output";
import {setDefaultSortAndPaginationIfNotExist} from "../../../../core/helper/set-default-sort-and-pagination";
import {blogService} from "../../services/blog.service";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";

export async function getBlogsListHandler(
    req: Request,
    res: Response,
) {
    try {

        const sanitizedQuery = matchedData(req, {
            locations: ['query'],
            includeOptionals: true,//include optional fields even if they are not sent
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const {items, totalCount} = await blogService.findAll(queryInput);

        const blogListOutput = mapBlogsListToOutput(items,
            {
                totalCount,
                pageNumber:queryInput.pageNumber,
                pageSize:queryInput.pageSize,
            }
            )

        res.status(HttpStatuses.Ok).send(blogListOutput);

    } catch (e) {
       errorHandler(e,res)
    }
}
