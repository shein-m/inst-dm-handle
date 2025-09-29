import prisma from "../../lib/prisma.js";

export const findOrCreateUser = async (igId, lang = "ru") => {
  let user = await prisma.user.findUnique({
    where: { igId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { igId, lang },
    });
  }

  return user;
};
