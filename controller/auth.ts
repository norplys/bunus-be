import { Request, Response } from "express";
import { encryptPassword, comparePassword, signJwt } from "../services/auth";
import { createUser, verifyEmail } from "../repositories/auth";
import { exclude } from "../helper/exclude";
import { randomUUID } from "crypto";
import { sendMail } from "../helper/nodeMailer";
import { formatEmail } from "../helper/emailFormat";

const register = async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;
  const hashedPassword = await encryptPassword(password);
  const id = randomUUID();
  const token = randomUUID();
  const subject = "Bubur Nusantara - Verify Your Email";
  const html = formatEmail(name, token);
  await sendMail(email, subject, html);
  const user = await createUser(id, email, hashedPassword, name, phone, token);
  const excludeUser = exclude(user, [
    "id",
    "createdAt",
    "updatedAt",
    "password",
  ]);
  return res.status(201).json({
    status: "success",
    data: {
      ...excludeUser,
    },
  });
};

const login = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const user = res.locals.user;
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        status: "Forbidden",
        message: "Invalid Password",
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const token = signJwt(payload);
    const excludeUser = exclude(user, [
      "id",
      "createdAt",
      "updatedAt",
      "password",
    ]);
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        ...excludeUser,
        token,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getMe = async (req: Request, res: Response) => {
  return res.status(200).json({
    status: "Success",
    message: "Succesfully Verify JWT",
    data: res.locals.user,
  });
};

const validateEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  const verify = await verifyEmail(token);
  res.status(200).json({
    status: "Success",
    message: "Successfully Verify Email",
    data: verify,
  });
};

export { register, login, getMe, validateEmail };
