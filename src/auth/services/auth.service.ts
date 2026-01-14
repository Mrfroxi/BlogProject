import {userQueryRepository} from "../../entities/user/repositories/user-query.repository";
import {bcryptService} from "../../core/services/bcrypt.service";
import {ResultType} from "../../core/result/result.type";
import {ResultStatus} from "../../core/result/resultCode";
import {jwtService} from "../../core/services/jwt.service";

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



}