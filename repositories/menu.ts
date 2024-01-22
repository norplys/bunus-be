import { prisma } from "../helper/prismaClient";

const getAllMenu = (id : string | undefined) => {
    if(!id){
        return prisma.menu.findMany();
    }
    return prisma.menu.findMany({
        where : {
            categoryId : id
        }
    })
}

export {
    getAllMenu
}