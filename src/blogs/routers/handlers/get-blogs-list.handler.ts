import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogsListToOutput} from "../mappers/map-blogs-list-to-output";
import {WithId} from "mongodb";
import { Request, Response } from 'express';
import {matchedData} from "express-validator";
import {PaginationDefaults} from "../../../core/types/pagination-and-sorting.default";
import {BlogSortField} from "../../../core/types/blog-sortField";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helper/set-default-sort-and-pagination";

export async function getBlogsListHandler(
    req: Request<{}, {}, {}>,
    res: Response,
) {
    try {

        const sanitizedQuery = matchedData<PaginationDefaults<BlogSortField>>(req, {
            locations: ['query'],
            includeOptionals: true,//include optional fields even if they are not sent
        });

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);



        res.sendStatus(HttpStatuses.Ok)

    } catch (e) {
        res.status(500).send('error');
    }
}

// export async function getBlogsListHandler(_req:Request, res:Response){
//
//     try{
//         const blogs: WithId<Blog>[] =  await blogsRepository.findAll()
//
//         res.status(HttpStatuses.Ok).send(mapBlogsListToOutput(blogs));
//
//     }catch (e:unknown){
//
//         res.sendStatus(HttpStatuses.InternalServerError)
//
//     }
//
//
// }