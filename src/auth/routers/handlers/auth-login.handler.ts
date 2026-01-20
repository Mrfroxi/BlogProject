import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {authService} from "../../services/auth.service";
import {ResultStatus} from "../../../core/object-result/resultCode";
import {resultCodeToHttpException} from "../../../core/object-result/resultCodeToHttpException";


export const authLoginHandler = async (req:Request,res:Response) => {

    const {loginOrEmail, password} = req.body;


    const result = await authService.loginUser(loginOrEmail, password);

    if (result.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }

    return res.status(HttpStatuses.Ok).send({accessToken: result.data!.accessToken});


}