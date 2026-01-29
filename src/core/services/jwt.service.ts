import jwt, {JwtPayload} from "jsonwebtoken";
import {SETTINGS} from "../setting/settings";
import {ResultStatus} from "../object-result/resultCode";
import {ResultType} from "../object-result/result.type";
import {refreshTokenBlackListService} from "../../entities/refreshToken-BlackList/refreshToken-BlackList.service";
import {RefreshTokenBlackList} from "../types/refreshToken-collection-mongo.type";

interface generateUserTokenDto {
    id:string,
    login?: string,

}


export const jwtService = {

    generateAuthUserToken : async (dto:generateUserTokenDto) => {
        return  jwt.sign(
            { login: dto.login,id:dto.id },
            SETTINGS.JWT_AUTH_SECRET,
            { expiresIn: SETTINGS.EXPIRES_AUTH as jwt.SignOptions['expiresIn'] }
        );
    },

    generateRefreshUserToken : async (dto:generateUserTokenDto) => {
        return  jwt.sign(
            { login: dto.login,id:dto.id },
            SETTINGS.JWT_REFRESH_SECRET,
            { expiresIn: SETTINGS.EXPIRES_REFRESH as jwt.SignOptions['expiresIn'] }
        );
    },

    verifyAuthToken: async (token:string):Promise<ResultType<JwtPayload|null>> => {


            const verifiedToken:JwtPayload  = jwt.verify(token, SETTINGS.JWT_AUTH_SECRET) as {id:string};

            if(!verifiedToken){

                return  {
                        status: ResultStatus.Unauthorized,
                        data: null,
                        extensions: [{ field: 'verifiedToken', message: 'jwt dont verify token.' }],
                      };
            }


            return     {
                    status: ResultStatus.Success,
                    data: verifiedToken,
                    extensions: [{ field: ' ', message: ' ' }],
            };

    },

    verifyRefreshToken: async (token:string):Promise<JwtPayload|ResultType> => {

        //time
        const verifiedTokenByExpired:JwtPayload  =  jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET) as {userId:string,login:string}

        if(!verifiedTokenByExpired){
            return {
                    status: ResultStatus.Unauthorized,
                    data: null,
                    extensions: [{ field: 'verifiedTokenByExpired', message: ' token not verified.' }],
            };
        }

        //blackList
        const verifiedTokenByBlackList:ResultType<boolean|null> = await refreshTokenBlackListService.blackLIstTokens(verifiedTokenByExpired,token)

        if(verifiedTokenByBlackList.data){
            return {
                status: ResultStatus.Success,
                data: verifiedTokenByBlackList.data,
                extensions: [{ field: ' ', message: ' ' }],
            };
        }

        return {
            status: ResultStatus.Unauthorized,
            data: null,
            extensions: [{ field: 'verifiedTokenByBlackList', message: 'token blackList' }],
        };

    }
}

