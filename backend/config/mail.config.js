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

const sendEmail = async({receipient, subject, message,html}) => {
    return await transport.sendMail({
        from: `Ecutz <${process.env.MAIL_USER}>`,
        to: receipient,
        subject,
        text: message,
        html,
    })
}

export default sendEmail