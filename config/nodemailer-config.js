const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.nauta.cu",
  port: 25,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

module.exports = { transporter };
