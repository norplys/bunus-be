import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = (email: string, password : string, name : string) => {
    return prisma.user.create({
        data: {
            email,
            password,
            name
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


export {
    createUser,
    findUser
}