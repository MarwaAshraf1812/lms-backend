import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().uuid(),

  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Level is required or must be one of the specified values",
  }),

  language: z.enum(["English", "Spanish", "French", "Arabic"]),

  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  requirements: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()).optional(),

  tags: z.array(z.string()).optional(),

  thumbnail: z.string().url().optional(),

  durationMinutes: z.number().int().min(10, "Duration must be at least 10 minutes"),

  price: z.number().nonnegative().default(0),
  discount: z.number().min(0).max(100).default(0),
  discountEnd: z.string().datetime().optional(),

  isFree: z.boolean().default(false),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
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
