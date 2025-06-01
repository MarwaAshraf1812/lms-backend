import { prisma } from "../../config/prisma";

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      courses: true,
      ratings: true,
    },
  });
}