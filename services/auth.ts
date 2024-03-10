import {
  findUser,
  findPhone,
  findId,
  getVerifyToken,
  updateVerifyToken,
  getForgotToken,
  deleteForgotToken,
} from "../repositories/auth";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { compare, hash } from "bcrypt";
import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { exclude } from "../helper/exclude";
import { errorMap } from "../helper/zError";
import { sendMail } from "../helper/nodeMailer";
import { checkIsExpired } from "../helper/checkIsExpired";
import { formatEmail, forgotPasswordEmail } from "../helper/emailFormat";
import { randomUUID } from "crypto";

const indonesiaPhone = new RegExp(/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/);

const dataSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  phone: z
    .string()
    .regex(indonesiaPhone, "Phone number must be Indonesia phone number"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signJwt = (payload: object) => {
  return sign(payload, process.env.SECRET_KEY as Secret, {
    expiresIn: "5h",
  });
};

const verifyJwt = (token: string) => {
  return verify(token, process.env.SECRET_KEY as Secret);
};

const encryptPassword = async (password: string) => {
  return await hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};

const validateRegisterBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name, phone } = req.body;
    dataSchema.parse({ email, password, name, phone });
    const checkUser = await findUser(email);
    const checkPhone = await findPhone(phone);
    if (checkUser || checkPhone) {
      if (checkUser?.isVerified === false) {
        const token = randomUUID();
        await updateVerifyToken(checkUser.id, token);
        await sendMail(
          checkUser.email,
          "Bubur Nusantara - Verify Your Email",
          formatEmail(checkUser.name, token),
        );
        return res.status(401).json({
          status: "error",
          message: "Email not verified, sending new email verification",
        });
      }
      return res.status(400).json({
        status: "error",
        message: "Email or Phone already exists!",
      });
    }
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = errorMap(err);
      return res.status(400).json({
        status: "error",
        message: errors,
      });
    }
  }
};

const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required!",
      });
    }
    loginSchema.parse({ email, password });
    const checkUser = await findUser(email);
    if (!checkUser) {
      return res.status(404).json({
        status: "error",
        message: "Email not registered",
      });
    }
    if (!checkUser.isVerified) {
      return res.status(401).json({
        status: "forbidden",
        message: "Email not verified, please verify your email",
      });
    }
    res.locals.user = checkUser;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = errorMap(err);
      return res.status(400).json({
        status: "error",
        message: errors,
      });
    }
  }
};

const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "Failed",
        message: "Missing Token",
      });
    }
    const { id } = verifyJwt(token) as JwtPayload;
    if (id) {
      const user = await findId(id);
      if (!user) {
        return res.status(401).json({
          status: "Failed",
          message: "Invalid Token",
        });
      } else {
        const excludeUser = exclude(user, [
          "createdAt",
          "updatedAt",
          "password",
        ]);
        res.locals.user = excludeUser;
        next();
      }
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid Token",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(401).json({
        status: "Failed",
        message: err.message,
      });
    } else {
      return res.status(500).json({
        status: "Failed",
        message: "Internal Server Error",
      });
    }
  }
};

const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = res.locals.user;
  if (user?.role !== "admin") {
    return res.status(403).json({
      status: "Failed",
      message: "Forbidden",
    });
  }
  next();
};

const checkTokenExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({
        status: "Failed",
        message: "Token is required",
      });
    }
    const checkToken = await getVerifyToken(token);
    if (!checkToken) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid Token",
      });
    }
    res.locals.token = checkToken;
    next();
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

const checkExpiredToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = res.locals.token;
    const isExpired = checkIsExpired(token.expiredAt);
    if (isExpired) {
      const userId = token.userId;
      const newToken = randomUUID();
      await updateVerifyToken(userId, newToken);
      await sendMail(
        token.user.email,
        "Bubur Nusantara - Verify Your Email",
        formatEmail(token.user.name, newToken),
      );
      return res.status(401).json({
        status: "Failed",
        message: "Token Expired, sending new email verification",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

const validateForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const emailSchema = z.object({
      email: z.string().email(),
    });
    const { email } = req.body;
    emailSchema.parse({ email });
    const user = await findUser(email);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Email not registered",
      });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

const checkIsForgotTokenExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, name, email } = res.locals.user;
    const token = await getForgotToken(id);
    if (token) {
      const isExpired = checkIsExpired(token.expiredAt!.toISOString());
      if (isExpired) {
        await deleteForgotToken(id);
        next();
        return;
      }
      const forgotEmailFormat = forgotPasswordEmail(name, token.token!);
      await sendMail(
        email,
        "Bubur Nusantara - Reset Your Password",
        forgotEmailFormat,
      );
      return res.status(200).json({
        status: "Success",
        message: "Token Found, sending new email verification",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

export {
  validateRegisterBody,
  validateLogin,
  encryptPassword,
  comparePassword,
  signJwt,
  verifyJwt,
  validateJwt,
  validateAdmin,
  checkTokenExist,
  checkExpiredToken,
  validateForgotPassword,
  checkIsForgotTokenExist,
};
