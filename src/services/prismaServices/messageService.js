import prisma from "../../lib/prisma.js";

export const saveMessages = async (userId, role, content) => {
  return prisma.message.create({
    data: { userId, role, content },
  });
};
