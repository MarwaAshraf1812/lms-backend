import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Level is required or must be one of the specified values ',
    invalid_type_error: 'Level must be a string',
  }),
  language: z.enum(['English', 'Spanish', 'French', 'Arabic']),
});

export const createModuleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(3),
  content: z.string().min(10),
  order: z.number().int().min(1),
});
