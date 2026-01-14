import {Request,Response} from "express";
import {DefaultValuesSortingDto} from "../../../user/dto/default-values-sorting.dto";
import {matchedData} from "express-validator";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {postService} from "../../services/post.service";
import {mapPostListToOutput} from "../mappers/map-posts-list-to-output";


export const getAllPostCommentHandler = async (req:Request,res:Response) => {

    const matchSortingData:DefaultValuesSortingDto = matchedData(req,{
        locations:['query','params'],
        includeOptionals:true,
    })

    const validatedParams = await postService.findAllComments(matchSortingData)

    res.status(HttpStatuses.Ok).send(validatedParams);
}