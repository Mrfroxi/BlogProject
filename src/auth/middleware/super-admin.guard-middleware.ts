import {Request,Response, NextFunction} from 'express'
import {HttpStatuses} from "../../core/types/http-statuses";


export const SuperAdminGuard = (req:Request,res:Response,next:NextFunction) =>{

    const authToken = req.headers['authorization'];

    if(!authToken || !authToken.startsWith('Basic ')){
        res.sendStatus(HttpStatuses.Unauthorized);
        return
    }

    const base64Token = authToken.split(' ')[1];

    const credentials = Buffer.from(base64Token, 'base64').toString('utf-8');

    const [login,password] = credentials.split(':');

    if(login !== process.env["ADMIN_USERNAME"] || password !== process.env["ADMIN_PASSWORD"]){
        res.sendStatus(HttpStatuses.Unauthorized);
        return
    }


    next()
}