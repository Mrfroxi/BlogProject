import {CreateUserDto} from "../dto/create-user.dto";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {User} from "../types/user";
import {validateUserUniqueness} from "./helpers/user-validate-uniqueness.helper";
import {userRepository} from "../repositories/user.repository";
import {UserOutputDto} from "../dto/user-output.dto";
import {bcryptService} from "../../../core/services/bcrypt.service";



export const userService = {

    async findUserById(userId:string):Promise<UserOutputDto>{
       return  userRepository.findUserById(userId);
    },


    async createUser(dto:CreateUserDto){

        const {email,login,password} = dto

            await validateUserUniqueness(email,login);

            const hashPassword = await bcryptService.userPasswordBcrypt(password);

            const validUser:User = {
                login:login,
                email:email,
                createdAt: `${new Date().toISOString()}`,
                password: hashPassword,
            }

            const createdUser: InsertOneResult<User> = await userRepository.createUser(validUser);

            return createdUser.insertedId.toString();


    },


    async deleteUser(userId:string){

        await this.findUserById(userId)

        await userRepository.deleteUserById(userId);

        return

    }



}