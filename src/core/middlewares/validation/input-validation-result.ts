import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError,FieldValidationError } from 'express-validator';
import { HttpStatuses } from '../../types/http-statuses';
import {ValidationErrorType} from "../../types/validator-error";





const formatterError = (error: ValidationError):ValidationErrorType => {

        const expressError = error as unknown as FieldValidationError;

        if ('path' in error) { // FieldValidationError
            return {
                field: expressError.path,
                message: expressError.msg,
            };
        }

        return {    //AlternativeValidationError
            field: 'AlternativeValidationError',
            message: expressError.msg,
        };
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = validationResult(req).formatWith(formatterError).array({ onlyFirstError: true });

    if (result.length > 0) {
        return res.status(HttpStatuses.BadRequest).send({
            "errorsMessages": result,
        });
    }

    next();
};
