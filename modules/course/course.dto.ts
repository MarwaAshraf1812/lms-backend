import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(3),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['english', 'spanish', 'french', 'Arabic']),
});

export const createModuleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(3),
  content: z.string().min(10),
  order: z.number().int().min(1),
});
