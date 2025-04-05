import { createTransport } from "nodemailer";
import { CONFIG } from "../config/config.js";
import { EMAIL_TYPES } from "../common/constants/email-types.js";


class MailService {
    constructor() {
        this.transporter = createTransport({
            host: CONFIG.MAIL.HOST,
            port: CONFIG.MAIL.PORT,
            auth: {
                user: CONFIG.MAIL.USER,
                pass: CONFIG.MAIL.PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async getMessageTemplate({ type, email }) {
        let message = '';
        switch (type) {
            case EMAIL_TYPES.WELCOME:
                message += `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px; background: #f8f8f8;">
                        <div style="text-align: center;">
                            <img src="cid:logo" alt="Marvel DC Funkos" width="150" style="margin-bottom: 20px;" />
                            <h1 style="color: #d32f2f;">¡Bienvenido a Marvel-DC Funkos!</h1>
                        </div>
                        <p style="font-size: 16px; color: #333;">Hola <strong>${email}</strong>,</p>
                        <p style="font-size: 16px; color: #333;">Gracias por registrarte a nuestra comunidad</p>
                        <p style="font-size: 14px; color: #999;">Este es un correo automático, por favor no respondas o te la verás con Thanos y el Jocker.</p>
                    </div>
                `;
                break;
        }
        return message;
    }
    async sendEmail({ to, subject, type }) {
        try {
            const html = await this.getMessageTemplate({ type, email: to });
            const info = await this.transporter.sendMail({
                from: CONFIG.MAIL.FROM,
                to,
                subject,
                html,
                attachments: [
                    {
                        filename: 'logo.png',
                        path: './public/img/logo.png',
                        cid: 'logo'
                    }
                ]
            });
            console.log("Email enviado", info.messageId);
        } catch (error) {
            console.error("Error al envier email", error);
        }
    }
}
export const mailService = new MailService();