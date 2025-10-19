import prisma from "../../lib/prisma.js";
import { languageDetect } from "../../services/langServices/checkLang.js";

export const findOrCreateUser = async (igId, message) => {
  let user = await prisma.user.findUnique({
    where: { igId },
  });

  if (!user) {
    const lang = languageDetect(message, 1);
    user = await prisma.user.create({
      data: { igId, lang },
    });
  }

  return user;
};
