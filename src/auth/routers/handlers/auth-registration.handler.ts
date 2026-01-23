import {Request,Response} from "express";
import {userService} from "../../../entities/user/services/user.service";
import {nodemailerService} from "../../../core/services/nodemailerService";
import {emailExamples} from "../../../core/helper/email-template";
import {ResultType} from "../../../core/object-result/result.type";
import {User} from "../../../entities/user/types/user";
import {ResultStatus} from "../../../core/object-result/resultCode";
import { resultCodeToHttpException } from "../../../core/object-result/resultCodeToHttpException";
import {HttpStatuses} from "../../../core/types/http-statuses";


export const authRegistrationHandler = async (req: Request, res: Response) => {

    const {email,login,password} = req.body;

    const createdUser:ResultType<User|null> = await userService.createUser({email,login,password});

    if (createdUser.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(createdUser.status)).send({
            errorsMessages:[...createdUser.extensions]
        });
    }

    //for empty data , ts
    if (createdUser.status !== ResultStatus.Success || !createdUser.data ) {
        return res.status(resultCodeToHttpException(createdUser.status)).send({
            errorsMessages:[...createdUser.extensions]
        });
    }

    await nodemailerService.sendEmail(
        createdUser.data.email,
        createdUser.data.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail
    )

    res.sendStatus(HttpStatuses.NoContent)
}