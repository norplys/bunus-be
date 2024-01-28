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

const getCartItem = (cartId: string, menuId: string) => {
  return prisma.cartItem.findUnique({
    where: {
      cartId,
      menuId,
    },
  });
};

const updateCartItem = (id: string, data: object) => {
  return prisma.cartItem.update({
    where: {
      id,
    },
    data,
  });
};
export { getUserCart, createCartItem, getCartItem, updateCartItem };
