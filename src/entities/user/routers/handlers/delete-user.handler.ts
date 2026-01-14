import {Request,Response} from "express";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {userService} from "../../services/user.service";


export  const deleteUserHandler =  async (req:Request,res:Response ) => {

    const userId = req.params.id;

    try {

       await userService.deleteUser(userId)

        res.sendStatus(HttpStatuses.NoContent)

    }catch (e){
        errorHandler(e,res)
    }
}