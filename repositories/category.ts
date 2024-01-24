import { prisma } from "../helper/prismaClient";

const getCategory = () => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

export { getCategory };
