import {Request, Response} from "express";
import {authService} from "../../services/auth.service";
import {ResultType} from "../../../core/object-result/result.type";
import {ResultStatus} from "../../../core/object-result/resultCode";
import {resultCodeToHttpException} from "../../../core/object-result/resultCodeToHttpException";
import {HttpStatuses} from "../../../core/types/http-statuses";



export const authLogoutHandler = async (req:Request, res:Response) => {


    const refreshToken= req.cookies.refreshToken

    const logOutResult:ResultType<null|boolean> = await authService.logOut(refreshToken)

    if (logOutResult.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(logOutResult.status)).send(logOutResult.extensions);
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });

    res.sendStatus(HttpStatuses.NoContent)

}