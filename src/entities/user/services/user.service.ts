import {CreateUserDto} from "../dto/create-user.dto";
import {InsertOneResult} from "mongodb";
import {User} from "../types/user";
import {validateUserUniqueness} from "./helpers/user-validate-uniqueness.helper";
import {userRepository} from "../repositories/user.repository";
import {UserOutputDto} from "../dto/user-output.dto";
import {bcryptService} from "../../../core/services/bcrypt.service";
import {ResultStatus} from "../../../core/object-result/resultCode";
import {ResultType} from "../../../core/object-result/result.type";



export const userService = {

    async findUserById(userId:string): Promise<ResultType<UserOutputDto | null>>{
       const user: UserOutputDto|null = await  userRepository.findUserById(userId);

       if(!user){
           return {
                   status: ResultStatus.NotFound,
                   data: null,
                   extensions: [{ field: 'userId', message: 'User Not found' }],
                    errorMessage : 'User Not found'
           };
       }

       return {
               status: ResultStatus.Success,
               data: user,
               extensions: [{ field: ' ', message: ' ' }],
        };

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
                emailConfirmation:{
                    confirmationCode: '',
                    expirationDate: null,
                    isConfirmed: true,
                }
            }

            const createdUser: InsertOneResult<User> = await userRepository.createUser(validUser);

            return createdUser.insertedId.toString();


    },

    async deleteUser(userId:string): Promise<ResultType<boolean | null>>{

        const user = await this.findUserById(userId);

        if(!user){
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: [{ field: 'userId', message: 'User Not found' }],
                errorMessage : 'User Not found'
            };
        }

        const deletedVerify:boolean = await userRepository.deleteUserById(userId);

        if(!deletedVerify){
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: [{ field: 'userId', message: 'User Not found for delete' }],
                errorMessage : 'User Not found'
            };
        }

        return {
                status: ResultStatus.Success,
                data: true,
                extensions: [{ field: ' ', message: ' ' }],
        };

    }

}