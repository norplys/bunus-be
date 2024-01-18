import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = (email: string, password : string, name : string, phone : string) => {
    return prisma.user.create({
        data: {
            email,
            password,
            name,
            phone
        }
    })
}

const findUser = (email: string) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

const findPhone = (phone:string) => {
    return prisma.user.findUnique({
        where: {
            phone
        }   
    })
}


export {
    createUser,
    findUser,
    findPhone
}