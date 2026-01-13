import {ObjectId, WithId} from "mongodb";
import bcrypt from "bcrypt";
import {userCollection} from "../../../db/mongo.db";
import { User } from "../types/user";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found";
import {mapUserToOutput} from "../routers/mappers/map-user-to-output";
import {DefaultValuesSortingDto} from "../dto/default-values-sorting.dto";
import {mapUserListToOutput} from "../routers/mappers/map-user-list-to-output";
import {UserOutputDto} from "../dto/user-output.dto";
import {UserListOutputDto} from "../dto/user-list-output.dto";
import {UnauthorizedError} from "../../../core/errors/Unauthorized-error";
import {bcryptService} from "../../../core/services/bcrypt.service";

export const userQueryRepository = {

        async findUserById(id:string) {

           const user:WithId<User> | null  = await userCollection.findOne({_id:new ObjectId(id)})

            if(!user){//ts
                throw new RepositoryNotFoundError()
            }
            return  mapUserToOutput(user);

        },

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

        async validateUserData(loginOrEmail:string,password:string){

            const user:WithId<User> | null = await userCollection.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            });

            if (!user) {
                throw new UnauthorizedError()
            }

            const isPasswordValid = await bcryptService.userPasswordCompare(password,user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedError()
            }

            return
        }

}