import { PrismaClient, Role } from '@prisma/client';

export const prisma = new PrismaClient();
export const userRole = Role;

