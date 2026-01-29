import {Request, Response,NextFunction} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {jwtService} from "../../../core/services/jwt.service";
import {JwtPayload} from "jsonwebtoken";
import {ResultType} from "../../../core/object-result/result.type";


export const refreshTokenValidator = async (req:Request, res:Response,next:NextFunction) => {

    const refreshToken= req.cookies.refreshToken

    if(!refreshToken){
        res.sendStatus(HttpStatuses.Unauthorized)
        return;
    }

    const verifyToken:JwtPayload|ResultType = await jwtService.verifyRefreshToken(refreshToken)

    if(!verifyToken.data){
        res.sendStatus(HttpStatuses.Unauthorized)
        return;
    }

    next()
}