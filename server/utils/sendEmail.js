const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If no credentials or dummy credentials configured, log and return without hanging
  if (
    !process.env.EMAIL_USER || 
    !process.env.EMAIL_PASS || 
    process.env.EMAIL_PASS === 'your_app_password' ||
    process.env.EMAIL_USER === 'noreply@humariumeed.org'
  ) {
    console.log('Skipping email send: SMTP credentials are not yet configured in .env');
    return;
  }

  // Create a transporter with connection timeouts
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Define email options
  const message = {
    from: `${process.env.EMAIL_FROM || process.env.EMAIL_USER}`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // Send the email
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
