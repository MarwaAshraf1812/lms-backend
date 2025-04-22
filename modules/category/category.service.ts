import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.dao";

export const HandleCreateCategory = async (name: string) => {
  try {
    return await createCategory(name);
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Error creating category");
    
  }
}

export const HandleGetAllCategories = async () => {
  try {
    return await getAllCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Error fetching categories");
  }
};

export const HandleGetCategoryById = async (id: string) => {
  try {
    return await getCategoryById(id);
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Error fetching category");
  }
};

export const HandleUpdateCategory = async (id: string, name: string) => {
  try {
    return await updateCategory(id, name);
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Error updating category");
  }
};

export const HandleDeleteCategory = async (id: string) => {
  try {
    return await deleteCategory(id);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Error deleting category");
  }
};