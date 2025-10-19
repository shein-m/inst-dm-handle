import prisma from "../../lib/prisma.js";

export const updateUserLanguage = async (userId, newLang) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { lang: newLang },
    });

    return user;
  } catch (err) {
    console.error("Error with changeLanguage:", err.message);
    throw err;
  }
};
