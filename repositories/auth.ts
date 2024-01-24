import { prisma } from "../helper/prismaClient";

const createUser = (
  email: string,
  password: string,
  name: string,
  phone: string,
) => {
  return prisma.user.create({
    data: {
      email,
      password,
      name,
      phone,
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
