import { Request, Response } from "express";
import { sendMail } from "../helper/nodeMailer";
import { homeEmailFormat, replyFormat } from "../helper/emailFormat";

const sendMailController = async (req: Request, res: Response) => {
  try {
    const { email, name, message } = req.body;
    const mail = homeEmailFormat(name, email, message);
    const reply = replyFormat(name);
    await sendMail("joywinata88@gmail.com", "Pesan Baru Dari Pelanggan", mail);
    await sendMail(email, "Terima Kasih Telah Menghubungi Kami", reply);
    res.status(200).json({
      status: "Success",
      message: "Email Sent",
    });
  } catch (err) {
    console.log(err);
  }
};

export { sendMailController };
