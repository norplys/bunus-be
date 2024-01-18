import { findUser, findPhone } from "../repositories/auth";
import { Request, Response, NextFunction } from "express";
import {z} from "zod";

const indonesiaPhone = new RegExp(/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/);

const dataSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    phone : z.string().regex(indonesiaPhone, "Phone number must be Indonesia phone number")
});

const validateAuthBody = async (req : Request, res : Response, next : NextFunction) => {
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
        const errorMap = err.errors.map((error) => {
            const key = error.path.join(".");
            return {
                [key]: error.message
            }
        });
        return res.status(400).json({
            status: "error",
            message: errorMap
        });
    }
 }
}


export {
    validateAuthBody
}