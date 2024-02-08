import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: "Bubur Nusantara <buburbunus@gmail.com>",
    to,
    subject,
    html,
  });
};

export { sendMail };
