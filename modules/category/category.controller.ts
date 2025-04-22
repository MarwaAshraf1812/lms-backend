import { Request, Response } from "express";
import {
  HandleCreateCategory,
  HandleGetAllCategories,
  HandleGetCategoryById,
  HandleUpdateCategory,
  HandleDeleteCategory,
} from "./category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const category = await HandleCreateCategory(name);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

export const getCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await HandleGetAllCategories();
    res.status(200).json({categories});
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const getCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await HandleGetCategoryById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category" });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await HandleUpdateCategory(id, name);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await HandleDeleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
