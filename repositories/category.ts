import { prisma } from "../helper/prismaClient";

const getCategory = () => {
    return prisma.category.findMany();
}

export {
    getCategory
}