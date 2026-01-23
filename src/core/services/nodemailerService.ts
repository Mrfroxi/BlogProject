import nodemailer from 'nodemailer';
import {SETTINGS} from "../setting/settings";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SETTINGS.NODEMAILER_EMAIL,
                pass: SETTINGS.NODEMAILER_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: SETTINGS.NODEMAILER_EMAIL,
            to: email,
            subject: 'Your code is here',
            html: template(code),
        });

        return !!info;
    },
};
