import { createUser, findUser} from "../repositories/auth";
import { Request, Response, NextFunction } from "express";
import { hash, compare } from "bcrypt";

const validateAuthBody = async (req : Request, res : Response, next : NextFunction) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            status: "error",
            message: "Email, password, and name are required!"
        });
    }

    const checkUser = await findUser(email);
    if (checkUser) {
        return res.status(400).json({ 
            status: "error",
            message: "Email already exists!"
        });
    }
    next();
}

const Register = async (req : Request, res : Response) => {
    const { email, password, name } = req.body;
    const hashedPassword = await hash(password, 10);
    const user = await createUser(email, hashedPassword, name);
    return res.status(201).json({
        status: "success",
        data: {
            user
        }
    });
}

export {
    validateAuthBody,
    Register
}