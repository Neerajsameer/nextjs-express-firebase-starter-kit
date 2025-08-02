import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export default async function sendEmail(params: { to: string[]; subject: string; html: string }) {
  const info = await transporter.sendMail({
    from: '"Sender Name" sender_email',
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: ["something@gmail.com"],
  });
}
