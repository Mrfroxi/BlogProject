import {Filter, ObjectId, WithId} from "mongodb";
import {userCollection} from "../../../db/mongo.db";
import { User } from "../types/user";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found";
import {mapUserToOutput} from "../routers/mappers/map-user-to-output";
import {DefaultValuesSortingDto} from "../dto/default-values-sorting.dto";
import {mapUserListToOutput} from "../routers/mappers/map-user-list-to-output";
import {UserOutputDto} from "../dto/user-output.dto";
import {UserListOutputDto} from "../dto/user-list-output.dto";
import bcrypt from "bcrypt";
import {UnauthorizedError} from "../../../core/errors/Unauthorized-error";

interface filterForRegex {
    email?: string;
    login?: string;
}
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

            const filter:any = {}

            if(searchEmailTerm){
                filter.email = { $regex: searchEmailTerm, $options: 'i' }
            }

            if(searchLoginTerm){
                filter.login = { $regex: searchLoginTerm, $options: 'i' }
            }

            const skip = (pageNumber - 1) * pageSize;


            const userList = await userCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray()


            const totalCount:number = await userCollection.countDocuments();

            const pagesCount:number = Math.ceil(totalCount / pageSize)

            const mappedUserList:UserOutputDto[] =  mapUserListToOutput(userList);

            return {
                pageCount:pagesCount,
                page:pageNumber,
                pageSize,
                totalCount,
                items:mappedUserList,
            }
        },

        async validateLogin(loginOrEmail:string,password:string){

            const user:WithId<User> | null = await userCollection.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            });

            if (!user) {
                throw new RepositoryNotFoundError()
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedError()
            }

            return
        }

}