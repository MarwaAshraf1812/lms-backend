import { Router } from "express";
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "./category.controller";
import { authMiddleware, roleMiddleware } from "../auth/auth.middleware";

const router = Router();

// 🔐 Protected routes for admins

router.post(
  "/",
  authMiddleware,
  
  roleMiddleware(["ADMIN", "INSTRUCTOR"]),
  createCategoryHandler
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "INSTRUCTOR"]),
  getCategoriesHandler
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "INSTRUCTOR"]),
  getCategoryHandler
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "INSTRUCTOR"]),
  updateCategoryHandler
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "INSTRUCTOR"]),
  deleteCategoryHandler
);

export default router;

