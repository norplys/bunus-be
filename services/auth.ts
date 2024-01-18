import {hash} from "bcrypt";
import {Request, Response} from "express";
import { createUser } from "../repositories/auth";


const Register = async (req : Request, res : Response) => {
    const { email, password, name, phone } = req.body;
    const hashedPassword = await encryptPassword(password);
    const user = await createUser(email, hashedPassword, name, phone);
    return res.status(201).json({
        status: "success",
        data: {
            user
        }
    });
}

const encryptPassword = async (password : string) => {
    return await hash(password, 10);
}

export {
    Register
}

