import {WithId} from "mongodb";
import { User } from "../../types/user";
import {UserOutputDto} from "../../dto/user-output.dto";


export const mapUserToOutput = (user:WithId<User>) => {

    const outputUser:UserOutputDto = {
        id:user._id.toString(),
        login:user.login,
        email:user.email,
        createdAt:user.createdAt,
        emailConfirmation:{
            confirmationCode:user.emailConfirmation.confirmationCode,
            expirationDate:user.emailConfirmation.expirationDate,
            isConfirmed:user.emailConfirmation.isConfirmed
        }

    }

    return outputUser
}