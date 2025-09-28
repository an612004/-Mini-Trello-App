import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service:"gmail", 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
    
  },
});
export async function sendVerificationCode(to: string, code: string) {
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to,
        subject: "Your Verification Code of Trello",
        text: `Your verification code is: ${code}`
    };
    
    await transporter.sendMail(mailOptions);
}