const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: pdfBuffer
        ? [
            {
              filename: "salary-slip.pdf",
              content: pdfBuffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully");

  } catch (err) {
    console.log("❌ Email error:", err.message);
  }
};

module.exports = sendEmail;