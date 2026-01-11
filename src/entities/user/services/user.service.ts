import {CreateUserDto} from "../dto/create-user.dto";


export const userService = {

    createUser(dto:CreateUserDto){

        const { login , email , password } = dto;

    }

}