const nodemailer = require("nodemailer");

const sendEmail = async (email) => {
  try {
    console.log(
      `🚀 ~ file: sendEmail.js:12 ~ process.env.APP_PASSWORD:`,
      process.env.APP_PASSWORD
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "bhosalenaresh73@gmail.com",
        pass: "xzug kxsf viul yvav",
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USEREMAIL,
      to: email,
      subject: `From सहाय्य भोजन`,
      html: `You have food near you, please visit <a href="${process.env.BASE_URL}">our website</a>.`,
    });
    console.log(`🚀 ~ file: sendEmail.js:19 ~ info:`, info);
  } catch (error) {
    console.error("Email not sent!");
    console.error(error);
    throw error;
  }
};
module.exports = { sendEmail };
