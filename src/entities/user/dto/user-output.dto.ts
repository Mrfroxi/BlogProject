

interface EmailConfirmationDto {
    confirmationCode: string;
    expirationDate: Date | null;
    isConfirmed: boolean;
}

export interface UserOutputDto {
    id: string;
    login: string;
    email: string;
    createdAt: string;
    emailConfirmation: EmailConfirmationDto;
}
