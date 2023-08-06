const nodemailer = require("nodemailer");

const Email = (options, res) => {
  let transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // email
      pass: process.env.PASSWORD, //password
    },
  });
  transpoter.sendMail(options, (err, info) => {
    if (err) {
      return res.status(400).json({ message: "Problem with sending email" });
    } else {
      return res.json({ message: "Success" });
    }
  });
};

module.exports = Email;
