import {Request,Response} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {userQueryRepository} from "../../../entities/user/repositories/user-query.repository";


export const authMeHandler = async (req:Request,res:Response) => {


    const userId:string|null= req.userId;

    const userData = await userQueryRepository.findUserByIdAuthMe(userId!)

    if(!userData){
        res.sendStatus(HttpStatuses.Unauthorized)
    }

    res.status(HttpStatuses.Ok).send(userData)


}