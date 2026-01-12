import {Request,Response} from "express";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {userQueryRepository} from "../../repositories/user-query.repository";
import {matchedData} from "express-validator";
import {DefaultValuesSortingDto} from "../../dto/default-values-sorting.dto";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {UserListOutputDto} from "../../dto/user-list-output.dto";


export const getUserListHandler = async (req:Request,res:Response) => {

    try{

        const matchSortingData:DefaultValuesSortingDto = matchedData(req,{
            locations:['query'],
            includeOptionals:true,
        })

        const userList:UserListOutputDto = await userQueryRepository.findAll(matchSortingData)

        res.status(HttpStatuses.Ok).send(userList)

    }catch (e){
        errorHandler(e,res)
    }

}