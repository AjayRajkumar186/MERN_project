const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Customize if using another provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Shopmate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    // If credentials are set, send the real email. Otherwise log it to console.
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } else {
      console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
    }
  } catch (error) {
    console.error("Error sending email:", error);
    // Continue execution even if email fails (or throw based on preference).
  }
};

module.exports = sendEmail;
