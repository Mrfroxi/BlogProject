import {CreateUserDto} from "../dto/create-user.dto";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {User} from "../types/user";
import {validateUserUniqueness} from "../routers/helpers/user-validate-uniqueness.helper";
import {userPasswordBcrypt } from "../routers/helpers/user-password-bcrypt.helper";
import {userRepository} from "../repositories/user.repository";



export const userService = {

    async findUserById(UserId:string){

    },


    async createUser(dto:CreateUserDto){

        const {email,login,password} = dto

            await validateUserUniqueness(email,login);

            const hashPassword = await userPasswordBcrypt(password);

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



    }



}