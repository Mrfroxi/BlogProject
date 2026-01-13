import bcrypt from "bcrypt";


export const bcryptService = {

    userPasswordBcrypt : async (password:string) => {

        const saltRounds = 10;

        return bcrypt.hash(password, saltRounds);

    },

    userPasswordCompare : async (password:string, userPassword:string):Promise<boolean> =>{
       return  bcrypt.compare(password, userPassword);
    }

}