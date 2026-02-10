import dotenv from 'dotenv';
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 5009,

  MONGO_URL: process.env.MONGO_URL || 'mongo',
  DB_NAME: process.env.DB_NAME || 'BlogProject',

  JWT_AUTH_SECRET: process.env.JWT_AUTH_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',

  ADMIN_USER: process.env.ADMIN_USERNAME || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',

  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL || '',
  NODEMAILER_PASS: process.env.NODEMAILER_PASS || '',

  EXPIRES_AUTH: process.env.EXPIRES_AUTH || '10s',
  EXPIRES_REFRESH: process.env.EXPIRES_REFRESH || '20s',

  LIMIT_REQUESTS: process.env.LIMIT_REQUESTS || 5,
  WINDOW_TIME_DELAY: process.env.WINDOW_TIME_DELAY || 10,
};
