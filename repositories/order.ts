import { prisma } from "../helper/prismaClient";

const createOrder = (
  total: number,
  items: any,
  userId: string,
  token: string,
  redirect_url: string,
) => {
  return prisma.order.create({
    data: {
      userId,
      total,
      payment: {
        create: {
          status: "pending",
          method: "cash",
          snap_token: token,
          snap_redirect_url: redirect_url,
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
