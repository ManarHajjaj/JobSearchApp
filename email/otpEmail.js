import nodeemailer from "nodemailer";
import { otpEmailHtml } from "./otpHtmlEmail.js";

// Function to send email
export const sendEmail = async (email, otp) => {
  // Implementation for sending email
  const transporter = nodeemailer.createTransport({
    service: "gmail",
    auth: {
      user: "manarhajjaj16@gmail.com",
      pass: "ggpspmriwzsbmtlc",
    },
  });

  const info = await transporter.sendMail({
    from: '"JobSearchApp Admin" <manarhajjaj16@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "OTP Forget Password", // Subject line
    html: otpEmailHtml(otp), // html body
  });
  console.log("Message sent: %s", info.messageId);
};
