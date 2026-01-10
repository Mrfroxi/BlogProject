import { Response } from 'express';
import {HttpStatuses} from "../../types/http-statuses";
import {RepositoryNotFoundError} from "../repository-not-found";

export  function errorHandler(error:unknown,res:Response){


    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HttpStatuses.NotFound;

        res.sendStatus(httpStatus)

        return;
    }

    res.status(HttpStatuses.InternalServerError);
    return;
}