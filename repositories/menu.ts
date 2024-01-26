import { prisma } from "../helper/prismaClient";

const selected = {
  id: true,
  name: true,
  image: true,
  price: true,
  description: true,
};

const getAllMenu = (id: string | undefined) => {
  if (!id) {
    return prisma.menu.findMany({
      select: selected,
    });
  }
  return prisma.menu.findMany({
    where: {
      categoryId: id,
    },
    select: selected,
  });
};

const getDetailMenu = (id: string) => {
  return prisma.menu.findUnique({
    where: {
      id,
    },
  });
};

type menu = {
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
};

const createMenu = (data: menu) => {
  return prisma.menu.create({
    data,
  });
};

const deleteMenu = (id: string) => {
  return prisma.menu.delete({
    where: {
      id,
    },
  });
};

export { getAllMenu, getDetailMenu, createMenu, deleteMenu };
