import { prisma } from "../helper/prismaClient";

const selected = {
    id : true,
    name : true,
    image : true,
    price : true,
    description : true,
}

const getAllMenu = (id : string | undefined) => {
    if(!id){
        return prisma.menu.findMany({
            select : selected
        });
    }
    return prisma.menu.findMany({
        where : {
            categoryId : id
        },
        select : selected
    })
}

export {
    getAllMenu
}