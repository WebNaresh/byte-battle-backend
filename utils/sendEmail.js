const nodemailer = require("nodemailer");

const sendEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `From सहाय्य भोजन`,
      html: `You have food near you, please visit <a href="${process.env.BASE_URL}">our website</a>.`,
    });
  } catch (error) {
    console.error("Email not sent!");
    console.error(error);
    throw error;
  }
};
module.exports = { sendEmail };
