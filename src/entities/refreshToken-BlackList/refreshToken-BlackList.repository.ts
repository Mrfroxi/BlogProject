import {refreshTokenBlackListCollection} from "../../db/mongo.db";
import {WithId} from "mongodb";
import {RefreshTokenBlackList} from "../../core/types/refreshToken-collection-mongo.type";
import {ResultStatus} from "../../core/object-result/resultCode";
import {ResultType} from "../../core/object-result/result.type";


export const refreshTokenBlackListRepository = {


    findTokensByUserId: async (id: string,token:string):Promise<ResultType<null|boolean>> => {


        const userBlackListTokens:WithId<RefreshTokenBlackList>|null =   await refreshTokenBlackListCollection.findOne({
            userId:id,
            revokedRefreshTokens: token,
        })


        if(userBlackListTokens){
           return  {
                   status: ResultStatus.Unauthorized,
                   data: null,
                   extensions: [{ field: 'userBlackListTokens', message: 'userBlackListTokens found' }],
           };
        }

        return  {
            status: ResultStatus.Success,
            data: true,
            extensions: [{ field: '', message: '' }],
        };

    },

    addInvalidToken: async (token:string,userId:string):Promise<boolean> => {

        const blackList = await refreshTokenBlackListCollection.updateOne(
            { userId },
            { $addToSet: { revokedRefreshTokens: token } },
            { upsert: true }
        )

        return blackList.acknowledged

    }



}