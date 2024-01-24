import { Request, Response } from "express";
import { encryptPassword, comparePassword, signJwt } from "../services/auth";
import { createUser } from "../repositories/auth";
import { exclude } from "../helper/exclude";

const register = async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;
  const hashedPassword = await encryptPassword(password);
  const user = await createUser(email, hashedPassword, name, phone);
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

export { register, login, getMe };
