import {userCollection} from "../../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {User} from "../types/user";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found";
import {mapUserToOutput} from "../routers/mappers/map-user-to-output";


export const userRepository = {

    async findUserById(id:string) {


        const user:WithId<User> | null  = await userCollection.findOne({_id:new ObjectId(id)})

        if(!user){//ts
            throw new RepositoryNotFoundError()
        }

        return  mapUserToOutput(user);

    },

    async createUser(dto:User){
        return  userCollection.insertOne(dto)
    },

    async deleteUserById(userId:string){
        return  userCollection.deleteOne({_id:new ObjectId(userId)})
    },

    async userUniqueLogin(userLogin:string):Promise<WithId<User>|null>{
        return userCollection.findOne({login:userLogin})
    },

    async userUniqueEmail(userEmail:string):Promise<WithId<User>|null>{
        return userCollection.findOne({email:userEmail})
    },

}

