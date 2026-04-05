const nodemailer = require('nodemailer');

// —————————————————————————————————————————————————————————————————————————————
// Send Email
// —————————————————————————————————————————————————————————————————————————————

const sendEmail = async ({ to, subject, text }) => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
   // console.warn(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
    return;
  }

  // Create transporter with explicit Gmail SMTP settings (more reliable than service shorthand)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS  // Must be a Gmail App Password (16 chars), NOT your login password
    },
    debug: process.env.NODE_ENV !== 'production', // logs SMTP traffic in dev
    logger: process.env.NODE_ENV !== 'production'
  });

  const mailOptions = {
    from: `"Shopmate" <${EMAIL_USER}>`,
    to,
    subject,
    text
  };

  // Verify connection before sending — this surfaces auth errors immediately
  await transporter.verify();

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${to}`);
};

module.exports = sendEmail;

