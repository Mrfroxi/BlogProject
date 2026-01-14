import {WithId} from "mongodb";
import { User } from "../../types/user";
import {UserAuthMeOutputDto} from "../../dto/userAuthMe-output.dto";


export const mapUserAuthMeToOutput = (user:WithId<User>) => {

    const outputUser:UserAuthMeOutputDto = {
        userId:user._id.toString(),
        login:user.login,
        email:user.email,
    }

    return outputUser
}