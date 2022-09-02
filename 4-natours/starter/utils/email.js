const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    //DEFINE email options
    const mailOptions = {
        from: 'Oliver Zhang <hello@natours.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    //send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;