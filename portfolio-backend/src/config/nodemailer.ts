import nodemailer from 'nodemailer';
import env from './env';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
        type: 'LOGIN',
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export default transporter;
// This snippet creates a nodemailer transporter object using the email and email password environment variables. The transporter object is then exported for use in other parts of the application.
