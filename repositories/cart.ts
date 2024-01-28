import { prisma } from "../helper/prismaClient";

const getUserCart = (id: string) => {
  return prisma.cart.findUnique({
    where: {
      userId: id,
    },
  });
};

const createCartItem = (
  cartId: string,
  menuId: string,
  quantity: number,
  total: number,
) => {
  return prisma.cartItem.create({
    data: {
      cartId,
      menuId,
      quantity,
      total,
    },
  });
};

export { getUserCart, createCartItem };
