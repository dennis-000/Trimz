import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PWD
    }
});

const sendEmail = async({ receipients, subject, message }) => {
    return await transport.sendMail({
        from: 'no-reply@example.com',
        to: receipients,
        subject,
        text: message,
        html: message,
    })
}

export default sendEmail