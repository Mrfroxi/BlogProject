import {Request,Response} from "express";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {userService} from "../../services/user.service";
import {ResultStatus} from "../../../../core/result/resultCode";
import {resultCodeToHttpException} from "../../../../core/result/resultCodeToHttpException";
import {ResultType} from "../../../../core/result/result.type";


export  const deleteUserHandler =  async (req:Request,res:Response ) => {

    const userId = req.params.id;

    const isDelete:ResultType<boolean | null> = await userService.deleteUser(userId)

    if (isDelete.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(isDelete.status)).send(isDelete.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent)

}