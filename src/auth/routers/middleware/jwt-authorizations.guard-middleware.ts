import {NextFunction, Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {jwtService} from "../../../core/services/jwt.service";


export const JwtAuthorizations = async (req:Request,res:Response,next:NextFunction) =>{

    if (!req.headers.authorization) return res.sendStatus(HttpStatuses.Unauthorized);

    const [authType, token] = req.headers.authorization.split(' ');

    if(authType !== 'Bearer') return res.sendStatus(HttpStatuses.Unauthorized);

    const payload = await jwtService.verifyToken(token)

    if (payload) {
        const { id } = payload;

        req.userId = id;

        next();

        return;
    }
    res.sendStatus(HttpStatuses.Unauthorized);

    return;
}