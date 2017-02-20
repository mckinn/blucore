'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport

// note that we will have to determine how to send an email from somebody else.

module.exports = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blucore.emaildaemon@gmail.com',
        pass: 'athens drive high school'
    }
});
