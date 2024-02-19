const nodemailer = require("nodemailer");
const CONFIG = require('./../config/config');


const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: CONFIG.EMAIL_HOST,
    port: 2525,
    auth: {
      user: CONFIG.EMAIL_USERNAME,
      pass: CONFIG.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Rose from Gallivanter  <hello@gallivanter.ng>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// from: "Kareem Yusuf  <hello@gmail.com>",


module.exports = sendEmail