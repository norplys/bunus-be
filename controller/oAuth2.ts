import { Request, Response } from "express";
import { signJwt } from "../services/auth";

const googleController = (req: Request, res: Response) => {
  const { id, email, name } = res.locals.user;
  const payload = {
    id,
    email,
    name,
  };
  const token = signJwt(payload);
  res
    .status(200)
    .redirect(
      `https://bunus.vercel.app?token=${token}email=${email}name=${name}`,
    );
};

export { googleController };
