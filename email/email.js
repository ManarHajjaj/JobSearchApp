import nodeemailer from "nodemailer";
import { emailHtml } from "./emailHtml.js";

export const sendEmails = async (email) => {
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
    subject: "JobSearch App Registeration", // Subject line
    html: emailHtml(), // html body
  });
  console.log("Message sent: %s", info.messageId);
};
