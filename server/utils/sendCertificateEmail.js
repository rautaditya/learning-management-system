const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendCertificateEmail = async (to, studentName, courseName) => {
  const subject = `🎓 Your Certificate for ${courseName}`;
  const html = `
    <h2>Congratulations ${studentName}!</h2>
    <p>You’ve successfully completed the <strong>${courseName}</strong> course.</p>
    <p>Your certificate has been issued and is available in your LMS dashboard.</p>
    <p><em>Keep learning and growing!</em></p>
  `;

  await transporter.sendMail({
    from: `"LMS Academy" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  });
};

module.exports = sendCertificateEmail;