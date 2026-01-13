import {Request,Response} from "express";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {authService} from "../../services/auth.service";


export const authLoginHandler = async (req:Request,res:Response) => {

    try{
        const {loginOrEmail,password} = req.body

        await authService.loginUser(loginOrEmail,password);

        res.sendStatus(HttpStatuses.NoContent)

    }catch (e){
        errorHandler(e,res)
    }





}