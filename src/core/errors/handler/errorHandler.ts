import { Response } from 'express';
import {HttpStatuses} from "../../types/http-statuses";
import {RepositoryNotFoundError} from "../repository-not-found";
import {UniqueValidateError} from "../unique-validate-error";
import {createErrorMessage} from "../message-error-create";
import {UnauthorizedError} from "../Unauthorized-error";

export  function errorHandler(error:unknown,res:Response){


    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HttpStatuses.NotFound;

        res.sendStatus(httpStatus)

        return;
    }

    if(error instanceof UniqueValidateError ){
        const httpStatus = HttpStatuses.BadRequest;

        res.status(httpStatus).send(createErrorMessage(error,error.field))
    }

    if(error instanceof UnauthorizedError ){
        const httpStatus = HttpStatuses.Unauthorized;

        res.sendStatus(httpStatus)
    }

    res.status(HttpStatuses.InternalServerError);
    return;
}