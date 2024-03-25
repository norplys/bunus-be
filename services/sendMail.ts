import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { errorMap } from "../helper/zError";

const messageSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  message: z.string(),
});

const sendMailService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name, message } = req.body;
    messageSchema.parse({ email, name, message });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = errorMap(err);
      return res.status(400).json({
        status: "Failed",
        message: errors,
      });
    }
  }
};

export { sendMailService };
