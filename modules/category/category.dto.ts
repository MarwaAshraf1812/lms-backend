import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is too short"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Updated category name is too short"),
});
