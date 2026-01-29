import {Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {refreshTokenBlackListService} from "../../../entities/refreshToken-BlackList/refreshToken-BlackList.service";
import {ResultType} from "../../../core/object-result/result.type";
import {ResultStatus} from "../../../core/object-result/resultCode";
import {resultCodeToHttpException} from "../../../core/object-result/resultCodeToHttpException";







export const authRefreshTokenHandler = async (req:Request, res:Response) => {


    const refreshToken= req.cookies.refreshToken

    const refreshTokens:ResultType<null|  {accessToken:string,refreshToken:string}> = await refreshTokenBlackListService.refreshTokens(refreshToken)

    if (refreshTokens.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(refreshTokens.status)).send(refreshTokens.extensions);
    }

    res.cookie('refreshToken', refreshTokens.data?.refreshToken, {httpOnly: true,secure: true})
    return res.status(HttpStatuses.Ok).send({accessToken: refreshTokens.data!.accessToken});

}