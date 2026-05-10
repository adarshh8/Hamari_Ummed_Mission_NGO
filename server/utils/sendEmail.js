const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Define email options
  const message = {
    from: `${process.env.EMAIL_FROM}`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // Send the email
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
