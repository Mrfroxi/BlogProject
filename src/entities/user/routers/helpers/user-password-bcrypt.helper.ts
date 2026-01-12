import bcrypt from "bcrypt";

export const userPasswordBcrypt = async (password:string) => {

    const saltRounds = 10;

    return bcrypt.hash(password, saltRounds);

}