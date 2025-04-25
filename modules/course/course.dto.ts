import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Level is required or must be one of the specified values ",
    invalid_type_error: "Level must be a string",
  }),
  language: z.enum(["English", "Spanish", "French", "Arabic"]),
});

export const moduleContentSchema = z.object({
  type: z.enum(["text", "video", "pdf", "image"]),
  data: z.string().min(3).optional(),
  url: z.string().url().optional(),
  alt: z.string().min(3).optional(),
  title: z.string().min(3).optional(),
});

export const createModuleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(3),
  order: z.number().int().min(1),
  content: z.array(moduleContentSchema).optional(),
});

export const updateModuleSchema = z.object({
  title: z.string().min(3).optional(),
  order: z.number().int().min(1).optional(),
  content: z.array(moduleContentSchema).optional(),
});

// ✅ Type for usage
export type CreateModuleData = z.infer<typeof createModuleSchema>;
export type UpdateModuleData = z.infer<typeof updateModuleSchema>;
