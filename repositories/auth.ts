import { prisma } from "../helper/prismaClient";

const createUser = (
  email: string,
  password: string | null,
  name: string,
  phone: string | null,
) => {
  return prisma.user.create({
    data: {
      email,
      password,
      name,
      phone,
      role: "USER",
      cart: {
        create: {},
      },
    },
  });
};

const findUser = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const findPhone = (phone: string) => {
  return prisma.user.findUnique({
    where: {
      phone,
    },
  });
};

const findId = (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};
export { createUser, findUser, findPhone, findId };
