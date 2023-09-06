import nodemailer from "nodemailer";
import config from "../../config";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if(to.length<5 || subject.length<1 || html.length<1){
      const errorMessage = to.length<5 ? "recipient(to) not specified" : subject.length<1  ? "subject not specified" : "html template not specified"
      throw new Error(errorMessage)
    }
    const response = await transport.sendMail({
      from: config.FROM_ADMIN_EMAIL,
      to,
      subject,
      html,
    });
    return response;
  } catch (error) {
    throw(error);
  }
};
