export type User = {
    login:string,
    email:string,
    password:string,
    createdAt:string,
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date | null;
        isConfirmed: boolean;
    }
}