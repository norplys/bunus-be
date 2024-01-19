import { Request, Response } from "express";
import { encryptPassword, comparePassword } from "../services/auth";
import { createUser } from "../repositories/auth";

const register = async (req : Request, res : Response) => {
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

const login = async (req : Request, res : Response) => {
    try{
    const {password} = req.body;
    const user = res.locals.user;
    const isValid = await comparePassword(password, user.password);
    if(!isValid){
        return res.status(401).json({
            status : "Forbidden",
            message : "Invalid Password"
        })
    }
    res.status(200).json({
        message : "Successfully logged in"
    })
    }
    catch(err){
        console.log(err)
    }
}

export {
    register,
    login
}