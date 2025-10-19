import prisma from "../lib/prisma.js";

export const updateUserLanguage = async (igId, newLang) => {
  try {
    const user = await prisma.user.update({
      where: { igId },
      data: { lang: newLang },
    });

    return user;
  } catch (err) {
    console.error("Ошибка при обновлении языка:", err.message);
    throw err;
  }
};
