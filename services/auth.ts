import { findUser, findPhone } from "../repositories/auth";
import { Request, Response, NextFunction } from "express";
import {z} from "zod";
import {compare, hash} from "bcrypt";
import { sign, verify } from "jsonwebtoken";

const indonesiaPhone = new RegExp(/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/);

const dataSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    phone : z.string().regex(indonesiaPhone, "Phone number must be Indonesia phone number")
});

const loginSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

const errorMap = (err : any) => {
    err.errors.map((error : any) => {
        const key = error.path.join(".");
        return {
            [key]: error.message
        }
    });
}

const encryptPassword = async (password : string) => {
    return await hash(password, 10);
}

const comparePassword = async (password : string, hash : string) => {
    return await compare(password, hash)
}

const validateRegisterBody = async (req : Request, res : Response, next : NextFunction) => {
 try{
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name || !phone) {
        return res.status(400).json({
            status: "error",
            message: "Email, password, phone, and name are required!"
        });
    }
    dataSchema.parse({email, password, name, phone});
    const checkUser = await findUser(email);
    const checkPhone = await findPhone(phone);
    if (checkUser || checkPhone) {
        return res.status(400).json({ 
            status: "error",
            message: "Email or Phone already exists!"
        });
    }
    next();
 }
 catch(err){
    if (err instanceof z.ZodError) {
        const errors = errorMap(err);
        return res.status(400).json({
            status: "error",
            message: errors
        });
    }
 }
}

const validateLogin = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required!"
            });
        }
        loginSchema.parse({email, password});
        const checkUser = await findUser(email);
        if (!checkUser) {
            return res.status(400).json({
                status: "error",
                message: "Email not registered"
            });
        }
        res.locals.user = checkUser
        next();
    }
    catch(err){
        if (err instanceof z.ZodError) {
            const errors = errorMap(err);
            return res.status(400).json({
                status: "error",
                message: errors
            });
        }
    }
}


    


export {
    validateRegisterBody,
    validateLogin,
    encryptPassword,
    comparePassword
}