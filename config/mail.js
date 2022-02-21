const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

module.exports.send = function (receiver, subject, message) {

    var transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    var mailOptions = {
        from: SMTP_USER,
        to: receiver,
        subject: subject,
        html: message
    };

    return transporter.sendMail(mailOptions).then((info) => {
        return info;
    }).catch((error) => {
        throw error;
    });
}