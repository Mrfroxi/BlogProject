import jwt from "jsonwebtoken";
import {SETTINGS} from "../setting/settings";

interface generateUserTokenDto {
    id:string,
    login: string,

}


export const jwtService = {

    generateUserToken : async (dto:generateUserTokenDto) => {
        return  jwt.sign(
            { login: dto.login,id:dto.id },
            SETTINGS.JWT_AUTH_SECRET,
            { expiresIn: "1h" }
        );
    },

    verifyToken: async (token:string) => {

        try {

            return jwt.verify(token, SETTINGS.JWT_AUTH_SECRET) as {id:string};

        } catch (error) {
            console.error("Token verify some error");
            return null;
        }

    },
}

