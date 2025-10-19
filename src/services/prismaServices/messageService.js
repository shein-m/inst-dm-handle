import prisma from "../../lib/prisma.js";

export const saveMessages = async (userId, role, content) => {
  console.log("check user id - ", userId);
  return prisma.message.create({
    data: { userId, role, content },
  });
};
