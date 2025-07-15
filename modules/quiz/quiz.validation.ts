import { z } from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  courseId: z.string().uuid("Invalid course ID format"),
  questions: z.array(
    z.object({
      text: z.string().min(1, "Question text is required"),
      correctOptionIndex: z
        .number()
        .int()
        .nonnegative("Correct option index must be a non-negative integer"),
      options: z
        .array(
          z.object({
            text: z.string().min(1, "Option text is required"),
          })
        )
        .min(2, "At least two options are required"),
    })
  ).min(1, "At least one question is required"),
});
