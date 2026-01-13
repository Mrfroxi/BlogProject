import {userQueryRepository} from "../../entities/user/repositories/user-query.repository";


export const authService = {

    loginUser: async (loginOrEmail:string,password:string) => {

        await userQueryRepository.validateUserData(loginOrEmail,password);

    },



}