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

const getVerifyToken = (token: string) => {
  return prisma.verify.findUnique({
    where: {
      verifyToken: token,
    },
  });
};

const deleteVerifyToken = (token: string) => {
  return prisma.verify.delete({
    where: {
      verifyToken: token,
    },
  });
};

const updateVerifyToken = (id: string, token: string) => {
  return prisma.verify.update({
    where: {
      userId: id,
    },
    data: {
      verifyToken: token,
      expiredAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  });
};

const verifyEmail = (token: string) => {
  return prisma.verify.update({
    where: {
      verifyToken: token,
    },
    data: {
      user: {
        update: {
          isVerified: true,
        },
      },
    },
  });
};

const createForgotToken = (id: string, token: string) => {
  return prisma.token.create({
    data: {
      userId: id,
      token,
      expiredAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  });
};

const updatePassword = (id: string, password: string) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
  });
};

export {
  createUser,
  findUser,
  findPhone,
  findId,
  getVerifyToken,
  verifyEmail,
  deleteVerifyToken,
  updateVerifyToken,
  updatePassword,
  createForgotToken,
};
