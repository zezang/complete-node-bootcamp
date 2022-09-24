const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email,
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Oliver Zhang <${process.env.EMAIL_FROM}>`
    };

    createTransport = () => {
        if (process.env.NODE_ENV === 'production') {
            
        };

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    };

    send = (template, subject) => {
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`)

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: options.message,
        };
    };

    sendWelcome = () => {
        this.send('welcome', 'Welcome to Natours!')
    };
};

const sendEmail = async (options) => {

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