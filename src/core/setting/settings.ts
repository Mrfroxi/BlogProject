import dotenv from 'dotenv';
dotenv.config();

export const SETTINGS = {
    PORT: process.env.PORT || 5009,
    MONGO_URL: process.env.MONGO_URL || "mongo",
    DB_NAME: process.env.DB_NAME || "BlogProject",
    JWT_AUTH_SECRET:process.env.JWT_AUTH_SECRET || '',
    ADMIN_USER :process.env.ADMIN_USERNAME || '',
    ADMIN_PASSWORD :process.env.ADMIN_PASSWORD || '',
    NODEMAILER_EMAIL:process.env.NODEMAILER_EMAIL || '',
    NODEMAILER_PASS:process.env.NODEMAILER_PASS || '',
};
