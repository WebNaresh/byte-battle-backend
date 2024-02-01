const nodemailer = require("nodemailer");

module.exports = async (email, subject, htmlContent, user, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USEREMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email not sent!");
    console.error(error);
    throw error;
  }
};
