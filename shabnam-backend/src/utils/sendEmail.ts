// utils/sendEmail.ts
import nodemailer from "nodemailer";

interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  attachments: Attachment[] = []
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    const mailOptions = {
      from: `"Shabnam Overseas" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    // console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
