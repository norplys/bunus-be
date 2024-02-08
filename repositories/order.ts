import { prisma } from "../helper/prismaClient";

const createOrder = (
  transaction_id: string,
  total: number,
  items: any,
  userId: string,
  token: string,
  redirect_url: string,
) => {
  return prisma.order.create({
    data: {
      id: transaction_id,
      userId,
      total,
      payment: {
        create: {
          status: null,
          method: null,
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
    include: {
      payment: true,
    },
  });
};

const deleteOrder = (id: string) => {
  return prisma.order.delete({
    where: {
      id,
    },
  });
};

const updatePaymentOrder = (id: string, data: object) => {
  return prisma.payment.update({
    where: {
      orderId: id,
    },
    data,
  });
};

export { createOrder, getAllUserOrder, deleteOrder, updatePaymentOrder };
