import {Request,Response} from "express";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {authService} from "../../services/auth.service";
import {ResultType} from "../../../core/object-result/result.type";
import {ResultStatus} from "../../../core/object-result/resultCode";
import {resultCodeToHttpException} from "../../../core/object-result/resultCodeToHttpException";


export const authRegistrationConfirmationHandler = async (req:Request,res:Response) => {

    const {code} = req.body;

    const verifyUser:ResultType<boolean | null> = await  authService.confirmationCode(code)

     if (verifyUser.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(verifyUser.status)).send({
          errorsMessages:[...verifyUser.extensions]
      });
    }

    res.sendStatus(HttpStatuses.NoContent)


}