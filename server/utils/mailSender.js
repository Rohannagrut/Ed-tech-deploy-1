const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      // host: process.env.MAIL_HOST,
      service: "gmail",
      auth: {
        // user: process.env.MAIL_USER,
        user: "rgnagrut_b20@ee.vjti.ac.in ",
        // pass: process.env.MAIL_PASS,
        pass: "jlcikdqvzjvrptjx",
      },
    });

    let info = await transporter.sendMail({
      from: "Runtime Educator's || Rohan Nagrut",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;
