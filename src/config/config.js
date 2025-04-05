import { config } from 'dotenv';
import { PERSISTENCE } from '../common/constants/persistence.js';

config({ path: '.env' });

export const CONFIG = {
    PORT: process.env.PORT || 1234,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PERSISTENCE: process.env.PERSISTENCE || PERSISTENCE.MEMORY,
    MAIL:{
        USER: process.env.NODEMAILER_USER,
        PASSWORD: process.env.NODEMAILER_PASSWORD,
        HOST: process.env.NODEMAILER_HOST,
        PORT: process.env.NODEMAILER_PORT,
        FROM: process.env.NODEMAILER_FROM,
    }
};

