import {userQueryRepository} from "../../entities/user/repositories/user-query.repository";
import {bcryptService} from "../../core/services/bcrypt.service";
import {ResultType} from "../../core/object-result/result.type";
import {ResultStatus} from "../../core/object-result/resultCode";
import {jwtService} from "../../core/services/jwt.service";
import {userService} from "../../entities/user/services/user.service";
import {UserOutputDto} from "../../entities/user/dto/user-output.dto";
import {nodemailerService} from "../../core/services/nodemailerService";
import {emailExamples} from "../../core/helper/email-template";

interface userCredentials {
    login:string,
    id:string,
    hashPassword:string
}

export const authService = {

    loginUser: async (loginOrEmail:string,password:string):Promise<ResultType<{accessToken:string}| null>> => {

        const userCredentials:userCredentials|null = await userQueryRepository.checkUserCredentials(loginOrEmail);

        if(!userCredentials){
            return {
                    status: ResultStatus.Unauthorized,
                    data: null ,
                    extensions: [{ field: 'email or login', message: 'Not Found' }],
                    errorMessage: 'Not Found',
            };
        }

        const isPasswordValid = await bcryptService.userPasswordCompare(password,userCredentials.hashPassword);

        if (!isPasswordValid) {
            return {
                status: ResultStatus.Unauthorized,
                data: null ,
                extensions: [{ field: 'password', message: 'Not Found' }],
                errorMessage: 'Not Found',
            };
        }

        const accessToken:string = await  jwtService.generateUserToken({login:userCredentials.login,id:userCredentials.id})

        return {
                status: ResultStatus.Success,
                data: { accessToken },
                extensions: [],
        };
    },

    confirmationCode: async (code:string):Promise<ResultType<boolean | null>> => {

        const user:ResultType<UserOutputDto|null> = await userService.verifyUserByCodeFromEmail(code);

        if(!user.data){
            return {
                status: user.status,
                data: user.data,
                extensions: [...user.extensions],
                errorMessage: user.errorMessage,
            };
        }

        const isConfirmed = user.data.emailConfirmation.isConfirmed;

        if(isConfirmed){
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'code', message: 'confirmation code is Confirmed' }],
                errorMessage: 'Confirmation Code is Confirmed',
            };
        }

        const userId = user.data.id

        const confirmedCode: ResultType<boolean | null> = await  userService.switchConfirmationStatus(userId)

        if(!confirmedCode.data){
            return {
                status: confirmedCode.status,
                data: null,
                extensions: [...confirmedCode.extensions],
                errorMessage: confirmedCode.errorMessage,
            }
        }

        return {
            status: ResultStatus.Success,
            data: confirmedCode.data,
            extensions: [],
        }

    },

    resendByEmail: async (email:string):Promise<ResultType<boolean|null>> => {

        const user:ResultType<UserOutputDto|null> = await userService.findUserByEmail(email)

        if(!user.data){
            return  {
                    status: ResultStatus.BadRequest,
                    data: user.data,
                    extensions: [{"field":"email","message":"email not found"}],
                    errorMessage : 'Email not found'
            }
        }

        const isConfirmed = user.data.emailConfirmation.isConfirmed;

        if(isConfirmed){
            return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    extensions: [{ field: 'email', message: 'isConfirmed' }],
                    errorMessage: 'Confirmation Code is Confirmed',
            };
        }

        const newCode = await userService.changeConfirmationCode(email);

        if(!newCode.data){
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{ field: 'newCode', message: 'BadRequest code' }],
                errorMessage: 'BadRequest code',
            }
        }

        await nodemailerService.sendEmail(
            user.data.email,
            newCode.data,
            emailExamples.registrationEmail
        )

        return {
            status: ResultStatus.Success,
            data: true,
            extensions: [{ field: '', message: '' }],
        }
    }


}