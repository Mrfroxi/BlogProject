import {Request,Response} from "express";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {userQueryRepository} from "../../../entities/user/repositories/user-query.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";


export const authLoginHandler = async (req:Request,res:Response) => {

    try{
        const {loginOrEmail,password} = req.body

        await userQueryRepository.validateLogin(loginOrEmail,password);

        res.sendStatus(HttpStatuses.NoContent)

    }catch (e){
        errorHandler(e,res)
    }





}