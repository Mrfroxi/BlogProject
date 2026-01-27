import {CreateUserDto} from "../dto/create-user.dto";
import {InsertOneResult, WithId} from "mongodb";
import {User} from "../types/user";
import {validateUserUniqueness} from "./helpers/user-validate-uniqueness.helper";
import {userRepository} from "../repositories/user.repository";
import {UserOutputDto} from "../dto/user-output.dto";
import {bcryptService} from "../../../core/services/bcrypt.service";
import {ResultStatus} from "../../../core/object-result/resultCode";
import {ResultType} from "../../../core/object-result/result.type";
import { add } from 'date-fns';
import {mapUserToOutput} from "../repositories/mappers/map-user-to-output";


export const userService = {

    findUserById: async (userId:string): Promise<ResultType<UserOutputDto | null>> => {
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

    createAdminUser: async (dto:CreateUserDto) => {

        const {email,login,password} = dto

            await validateUserUniqueness(email,login);

            const hashPassword = await bcryptService.userPasswordBcrypt(password);

            const validAdminUser:User = {
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

            const createdUser: InsertOneResult<User> = await userRepository.createUser(validAdminUser);

            return createdUser.insertedId.toString();


    },

    //using this
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

    },


    findUserByEmail : async (email:string):Promise< ResultType<UserOutputDto|null>> => {

        const validEmail:WithId<User> | null = await userRepository.userUniqueEmail(email);

        if(!validEmail){
            return {
                    status: ResultStatus.NotFound,
                    data: null ,
                    extensions: [{ field: 'email', message: 'email not found' }],
                    errorMessage : 'Email Not found'
            };
        }


        return  {
                status: ResultStatus.Success,
                data: mapUserToOutput(validEmail),
                extensions: [{ field: ' ', message: ' ' }],
              };

    },

    findUserByLogin: async (login:string) => {

        const validLogin:WithId<User> | null = await userRepository.userUniqueLogin(login);

        if(!validLogin){
            return {
                status: ResultStatus.NotFound,
                data: null ,
                extensions: [{ field: 'login', message: 'login not found' }],
                errorMessage : 'Login Not found'
            };
        }


        return  {
            status: ResultStatus.Success,
            data: validLogin,
            extensions: [{ field: ' ', message: ' ' }],
        };

    },

    async createUser(dto:CreateUserDto){

        const {email,login,password} = dto

        const validEmail = await this.findUserByEmail(email);

        if(validEmail.data){
            return {
                status: ResultStatus.BadRequest,
                data:null,
                extensions: [{ field: 'email', message: 'email exists' }],
                errorMessage: 'Email exists',
            };
        }
        const validLogin = await this.findUserByLogin(login);

        if(validLogin.data){
            return {
                status: ResultStatus.BadRequest,
                data:null,
                extensions: [{ field: 'login', message: 'login exists' }],
                errorMessage: 'Login exists',
            };
        }



        const hashPassword = await bcryptService.userPasswordBcrypt(password);

        const validUser:User = {
            login:login,
            email:email,
            createdAt: `${new Date().toISOString()}`,
            password: hashPassword,
            emailConfirmation:{
                confirmationCode: crypto.randomUUID(),
                expirationDate: add(new Date(),{
                    hours:1,
                }),
                isConfirmed: false,
            }
        }

        const createdUser: InsertOneResult<User> = await userRepository.createUser(validUser);

        if(!createdUser.acknowledged){
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'db', message: 'doesnt inset' }],
                errorMessage: 'doesnt inset user entity ',
            };
        }

        return {
                status: ResultStatus.Success,
                data: validUser,
                extensions: [{ field: ' ', message: ' ' }],
        };

    },

    verifyUserByCodeFromEmail : async (userCode:string) => {

        const user:UserOutputDto | null = await userRepository.userVerifyCode(userCode)

        if(!user){
            return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    extensions: [{ field: 'code', message: 'confirmation code not exists' }],
                    errorMessage: 'Confirmation Code Not Found',
            };
        }

        return {
                status: ResultStatus.Success,
                data: user,
                extensions: [{ field: ' ', message: ' ' }],
        };
    },

     async switchConfirmationStatus  (userId:string):Promise<ResultType<boolean|null>> {
        const verifiedUser = await this.findUserById(userId);

        if(!verifiedUser.data){
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'userId', message: 'BadRequest' }],
                errorMessage : 'BadRequest'
            }
        }

        const userConfirmed:boolean = await userRepository.userSwitchEmailIsConfirmed(userId)

         if(!userConfirmed){
             return {
                 status: ResultStatus.BadRequest,
                 data: null,
                 extensions: [{ field: 'userId', message: 'BadRequest switch' }],
                 errorMessage : 'BadRequest switch'
             }
         }

         return {
             status: ResultStatus.Success,
             data: userConfirmed,
             extensions: [{ field: '', message: '' }],
         }
    },

    changeConfirmationCode: async (email:string) => {
        const newConfirmedCode = crypto.randomUUID();

        const changedConfirmationCode = userRepository.userChangeConfirmedCode(email,newConfirmedCode)

        if(!changedConfirmationCode){
            return{
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'ConfirmationCode', message: 'BadRequest change' }],
                errorMessage : 'BadRequest change'
            }
        }

        return {
            status: ResultStatus.Success,
            data: newConfirmedCode,
            extensions: [{ field: '', message: '' }],
        }
    }

}