import {HttpStatuses} from "../../../core/types/http-statuses";
import { Request, Response } from 'express';
import {matchedData} from "express-validator";;
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helper/set-default-sort-and-pagination";
import {blogService} from "../../services/blog.service";
import {BlogQueryInput} from "../../dto/blog-query-input";

export async function getBlogsListHandler(
    req: Request,
    res: Response,
) {
    try {

        const sanitizedQuery = matchedData<BlogQueryInput>(req, {
            locations: ['query'],
            includeOptionals: true,//include optional fields even if they are not sent
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const blogList = blogService.findAll(queryInput);

        res.sendStatus(HttpStatuses.Ok)

    } catch (e) {
        res.status(500).send('error');
    }
}
