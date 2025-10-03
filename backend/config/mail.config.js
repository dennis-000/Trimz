import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const port = parseInt(process.env.MAIL_PORT || '587', 10);
const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port,
    secure: port === 465, // true for 465, false for other ports like 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PWD
    }
});

const sendEmail = async({receipient, subject, message,html}) => {
    return await transport.sendMail({
        from: `Trimz <${process.env.MAIL_USER}>`,
        to: receipient,
        subject,
        text: message,
        html,
    })
}

export default sendEmail