import {userCollection} from "../../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {User} from "../types/user";
import {mapUserToOutput} from "./mappers/map-user-to-output";
import {UserOutputDto} from "../dto/user-output.dto";


export const userRepository = {

    async findUserById(id:string): Promise<UserOutputDto | null> {

        const user:WithId<User> | null  = await userCollection.findOne({_id:new ObjectId(id)})

        if(!user){
            return null
        }

        return  mapUserToOutput(user);

    },

    async createUser(dto:User){
        return  userCollection.insertOne(dto)
    },

    async deleteUserById(userId:string){
        //Returns true if deleted, otherwise false
        const isDeleted   = await userCollection.deleteOne({_id:new ObjectId(userId)})

        return isDeleted.deletedCount === 1 && isDeleted.acknowledged;

    },

    async userUniqueLogin(userLogin:string):Promise<WithId<User>|null>{
        return userCollection.findOne({login:userLogin})
    },

    async userUniqueEmail(userEmail:string):Promise<WithId<User>|null>{
        return userCollection.findOne({email:userEmail})
    },

    async userVerifyCode(userCode:string):Promise<UserOutputDto|null>{
        const user:WithId<User>| null  = await userCollection.findOne({"emailConfirmation.confirmationCode":userCode})

        if(!user){
            return null
        }

        return  mapUserToOutput(user)
    },

    async userSwitchEmailIsConfirmed(userId:string){
        const switchedUser = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { "emailConfirmation.isConfirmed": true } }
        );

        return switchedUser.acknowledged
    },

    async userChangeConfirmedCode(userEmail:string,newCode:string){
        const switchedUser = await userCollection.updateOne(
            { email: userEmail },
            { $set: { "emailConfirmation.confirmationCode": newCode } }
        );

        return switchedUser.acknowledged
    }

}

