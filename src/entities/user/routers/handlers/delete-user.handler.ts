import {Request,Response} from "express";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {userRepository} from "../../repositories/user.repository";
import {HttpStatuses} from "../../../../core/types/http-statuses";


export  const deleteUserHandler =  async (req:Request,res:Response ) => {

    const userId = req.params.id;

    try {

        await userRepository.findUserById(userId);

        await userRepository.deleteUserById(userId);

        res.sendStatus(HttpStatuses.NoContent)

    }catch (e){
        errorHandler(e,res)
    }
}