const nodemailer = require('nodemailer');

const mail = nodemailer.createTransport({
    name: process.env.MAIL_HOST,
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports = mail;