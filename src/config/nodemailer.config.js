const nodemailer = require("nodemailer");

module.exports.transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, //ssl
    auth: {
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});