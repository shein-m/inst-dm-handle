import prisma from "../../lib/prisma.js";

export const findUserLanguage = async (igId) => {
  let user = await prisma.user.findUnique({
    where: { igId },
  });

  if (!user) return null;

  return user.lang;
};
