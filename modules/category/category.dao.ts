import { prisma } from "../../config/prisma";

export const createCategory = async (name: string) => {
  // Check if the category already exists
  const existingCategory = await prisma.category.findFirst({
    where: { name },
  });
  if (existingCategory) {
    throw new Error("Category already exists");
  }
  return prisma.category.create({ data: { name } });
};

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({ where: { id } });
};

export const updateCategory = async (id: string, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

export const getCategoryByName = async (categoryName: string) => {
  try {
    return await prisma.category.findUnique({
      where: { name: categoryName },
    });
  } catch (error) {
    throw new Error("Error fetching category");
  }
};
