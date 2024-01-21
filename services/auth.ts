import { findUser, findPhone, findId } from "../repositories/auth";
import { Request, Response, NextFunction } from "express";
import {z} from "zod";
import {compare, hash} from "bcrypt";
import { Jwt, JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { exclude } from "../helper/exclude";

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

const signJwt = (payload : object) => {
    return sign(payload, process.env.SECRET_KEY as Secret, {
        expiresIn : '2h'
    })
}

const verifyJwt = (token : string) => {
    return verify(token, process.env.SECRET_KEY as Secret)
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
            return res.status(404).json({
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

const validateJwt = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                status : "Failed",
                message : "Missing Token"
            })
        }
        const { id } = verifyJwt(token) as JwtPayload;
            if( id ){
            const user = await findId(id);
            if(!user){
                return res.status(401).json({
                    status : "Failed",
                    message : "Invalid Token"
                })
            }else{
                const excludeUser = exclude(user, ['createdAt','updatedAt','password']);
                res.locals.user = excludeUser
                next();
            }
        } else {
            return res.status(401).json({
                status : "Failed",
                message : "Invalid Token"
            })
        }
    }
    catch(err){
        if (err instanceof Error) {
            return res.status(401).json({
                status : "Failed",
                message : err.message
            })
        }else{
            return res.status(500).json({
                status : "Failed",
                message : "Internal Server Error"
            })
        }
    }
}


    


export {
    validateRegisterBody,
    validateLogin,
    encryptPassword,
    comparePassword,
    signJwt,
    verifyJwt,
    validateJwt
}