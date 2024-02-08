import { prisma } from "../helper/prismaClient";

const createUser = (
  id: string,
  email: string,
  password: string | null,
  name: string,
  phone: string | null,
  token: string | null,
  isVerified: boolean = false,
) => {
  return prisma.user.create({
    data: {
      id,
      email,
      password,
      name,
      phone,
      role: "USER",
      isVerified,
      cart: {
        create: {},
      },
      verify: {
        create: {
          verifyToken: token,
          expiredAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        },
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
