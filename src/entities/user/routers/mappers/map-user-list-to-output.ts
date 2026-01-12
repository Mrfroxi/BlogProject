import {WithId} from "mongodb";
import {User} from "../../types/user";
import {mapUserToOutput} from "./map-user-to-output";
import {UserOutputDto} from "../../dto/user-output.dto";


export const mapUserListToOutput =  (userList:WithId<User>[]) : UserOutputDto[] => {

    return userList.map(elem => {
       return  mapUserToOutput(elem);
    })


}