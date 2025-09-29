import prisma from "../../lib/prisma.js";

export const handleUserMessages = async (user) => {
  const history = await prisma.message.findMany({
    where: { userId: user.id },
    orderBy: { id: "asc" },
    select: { role: true, content: true },
  });

  return history;
};

// сделать чтобы он тянул не всю историю
