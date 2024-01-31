import { prisma } from "../helper/prismaClient";

const createOrder = (items: any, userId: string) => {
  return prisma.order.create({
    data: {
      userId: userId,
      payment: {
        create: {
          status: "pending",
          method: "cash",
        },
      },
      items: {
        createMany: {
          data: items,
        },
      },
    },
    include: {
      items: true,
    },
  });
};

export { createOrder };
