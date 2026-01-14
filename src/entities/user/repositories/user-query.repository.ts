import {ObjectId, WithId} from "mongodb";
import {userCollection} from "../../../db/mongo.db";
import { User } from "../types/user";
import {DefaultValuesSortingDto} from "../dto/default-values-sorting.dto";
import {mapUserListToOutput} from "./mappers/map-user-list-to-output";
import {UserOutputDto} from "../dto/user-output.dto";
import {UserListOutputDto} from "../dto/user-list-output.dto";
import {mapUserAuthMeToOutput} from "./mappers/map-userAuthMe-to-output";

export const userQueryRepository = {


        async findAll(sortingDefault:DefaultValuesSortingDto): Promise<UserListOutputDto> {

            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchEmailTerm,
                searchLoginTerm
            } = sortingDefault


            const orFilter: any[] = [];

            if (searchLoginTerm) {
                orFilter.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
            }

            if (searchEmailTerm) {
                orFilter.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
            }

            const filter = orFilter.length > 0 ? { $or: orFilter } : {};



            const skip = (pageNumber - 1) * pageSize;
            const sortDirMongo = sortDirection === 'asc' ? 1 : -1;

            const userList = await userCollection
                .find(filter)
                .sort({ [sortBy]: sortDirMongo })
                .skip(skip)
                .limit(pageSize)
                .toArray()


            const totalCount: number = await userCollection.countDocuments(filter);

            const pagesCount:number = Math.ceil(totalCount / pageSize)

            const mappedUserList:UserOutputDto[] =  mapUserListToOutput(userList);

            return {
                pagesCount:pagesCount,
                page:pageNumber,
                pageSize,
                totalCount,
                items:mappedUserList,
            }
        },

        async checkUserCredentials(loginOrEmail:string){
            //result object
            const user:WithId<User> | null = await userCollection.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            });

            if (!user) {
                return null;
            }

            return {
                login:user.login,
                id:user._id.toString(),
                hashPassword:user.password
            }
        },

        async AuthMeById(id:string) {

        const user:WithId<User> | null  = await userCollection.findOne({_id:new ObjectId(id)})

        if(!user){//ts
            return null
        }

        return  mapUserAuthMeToOutput(user);

    },

}