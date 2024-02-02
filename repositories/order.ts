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

const getAllUserOrder = (userId: string) => {
  return prisma.order.findMany({
    where: {
      userId,
    },
  });
};

const deleteOrder = (userId: string, id: string) => {
  return prisma.order.delete({
    where: {
      id,
    },
  });
};

export { createOrder, getAllUserOrder, deleteOrder };
