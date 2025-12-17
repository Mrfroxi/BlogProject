import {NextFunction, Request, Response} from 'express'
import {validationResult} from "express-validator";
import {HttpStatuses} from "../types/http-statuses";


export  const inputValidationResultMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const result = validationResult(req);

    if(!result.isEmpty() ){
        res.status(HttpStatuses.BadRequest).send(result);
        return
    }

    next()
}