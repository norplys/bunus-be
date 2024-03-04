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

const getCartData = (id: string) => {
  return prisma.cart.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      items: {
        select: {
          total: true,
          quantity: true,
          id: true,
          menu: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

const deleteCartData = (cartId: string) => {
  return prisma.cartItem.deleteMany({
    where: {
      cartId,
    },
  });
};

const deleteCartItem = (id: string) => {
  return prisma.cartItem.delete({
    where: {
      id,
    },
  });
};

const findCartItem = (id: string) => {
  return prisma.cartItem.findUnique({
    where: {
      id,
    },
  });
};

const cartNotif = (id: string) => {
  return prisma.cartItem.count({
    where: {
      cartId: id,
    },
  });
};

export {
  getUserCart,
  createCartItem,
  getCartItem,
  updateCartItem,
  getCartData,
  deleteCartData,
  deleteCartItem,
  findCartItem,
  cartNotif,
};
