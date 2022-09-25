const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email,
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Oliver Zhang <${process.env.EMAIL_FROM}>`
    };

    newTransport = () => {
        if (process.env.NODE_ENV === 'production') {
            return 1;
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

    send = async (template, subject) => {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`)

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
        };

        this.newTransport();
        await this.newTransport().sendMail(mailOptions);
    };

    sendWelcome = async () => {
        await this.send('welcome', 'Welcome to Natours!')
    };

    sendPasswordReset = async () => {
        await this.send('passwordReset', 'Your password reset token')
    };
};


// module.exports = Email;