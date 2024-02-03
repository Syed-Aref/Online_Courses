// Import packages
const nodemailer = require("nodemailer");

// Email sending function
const sendEmail = async (to, messageContent) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "songokudhm@gmail.com",
        pass: "erzi ubsl jxyv xwyv",
      },
    });

    // Message obj
    const message = {
      to: to,
      subject: "New Message from Nodemailer APP",
      html: `
            <h3>You have received a new message from Nodemailer APP</h3>
            <p>${messageContent}</p>
            `,
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log("(SystemMessage_sendEmail_sendEmail.js) Message sent and info.messageId = ", info.messageId);
  }catch (error) {
    console.log(error);
    throw new Error("(SystemFailure_sendEmail_sendEmail.js) Email could not be sent");
  }
};

module.exports = sendEmail;