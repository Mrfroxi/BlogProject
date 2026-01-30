import {Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {jwtService} from "../../../core/services/jwt.service";







export const authRefreshTokenHandler = async (req:Request, res:Response) => {

    const refreshToken= req.cookies.refreshToken

    if(!refreshToken){
        res.sendStatus(HttpStatuses.Unauthorized)
    }

    const verifyToken = await jwtService.verifyRefreshToken(refreshToken)

    if(!verifyToken){

    }

    res.sendStatus(HttpStatuses.Ok)
}