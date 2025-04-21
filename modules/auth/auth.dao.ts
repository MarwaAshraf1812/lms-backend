import { prisma, userRole } from '../../config/prisma';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async ({
  email,
  password,
  role,
  username,
}: {
  email: string;
  password: string;
  role: keyof typeof userRole;
  username?: string;
}) => {
  return prisma.user.create({
    data: { 
      email, 
      password, 
      role: userRole[role], 
      username: username ?? email.split('@')[0] 
    },
  });
};
