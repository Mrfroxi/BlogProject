import {Request,Response} from "express";
import {userService} from "../../services/user.service";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {UserOutputDto} from "../../dto/user-output.dto";
import {userRepository} from "../../repositories/user.repository";


export const createUserHandler = async (req:Request,res:Response) => {

    const reqBody = req.body;

    try {
        const createdUserId:string = await userService.createUser(reqBody);

        const user:UserOutputDto = await  userRepository.findUserById(createdUserId)

        res.status(HttpStatuses.Created).send(user)

    }catch(e:unknown){
        errorHandler(e,res)
    }


}