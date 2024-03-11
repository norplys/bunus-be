import { Request, Response } from "express";
import { encryptPassword, comparePassword, signJwt } from "../services/auth";
import {
  createUser,
  verifyEmail,
  deleteVerifyToken,
  createForgotToken,
  updatePassword,
  deleteForgotToken,
} from "../repositories/auth";
import { exclude } from "../helper/exclude";
import { randomUUID } from "crypto";
import { sendMail } from "../helper/nodeMailer";
import { formatEmail, forgotPasswordEmail } from "../helper/emailFormat";

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
      return res.status(400).json({
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
  await deleteVerifyToken(token);
  res.status(200).json({
    status: "Success",
    message: "Successfully Verify Email",
    data: verify,
  });
};

const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { id, name, email } = res.locals.user;
    const token = randomUUID();
    const subject = "Bubur Nusantara - Reset Your Password";
    const html = forgotPasswordEmail(name, token);
    await createForgotToken(id, token);
    await sendMail(email, subject, html);
    res.status(200).json({
      status: "Success",
      message: "Email has been sent",
    });
  } catch (err) {
    console.log(err);
  }
};

const resetPasswordController = async (req: Request, res: Response) => {
  const { userId } = res.locals.token;
  const { password } = req.body;
  const hashedPassword = await encryptPassword(password);
  const user = await updatePassword(userId, hashedPassword);
  await deleteForgotToken(userId);
  res.status(200).json({
    status: "Success",
    message: "Password has been reset",
    data: user,
  });
};
export {
  register,
  login,
  getMe,
  validateEmail,
  forgotPasswordController,
  resetPasswordController,
};
