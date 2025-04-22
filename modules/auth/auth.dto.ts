import { z } from 'zod';
const allowedRoles = ['ADMIN', 'STUDENT', 'INSTRUCTOR'] as const;

export const registerUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(allowedRoles).default('STUDENT'),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(allowedRoles).optional()
});