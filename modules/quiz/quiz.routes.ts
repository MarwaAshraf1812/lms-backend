import { Router } from "express";
import { createQuizHandler } from "./quiz.controller";
import { authMiddleware, roleMiddleware } from "../auth/auth.middleware";

const router = Router();

/**
 * @route POST /
 * @group Quiz - Operations related to quizzes
 * @description Creates a new quiz with the provided data.
 * @returns {Quiz} 201 - Successfully created quiz
 */
router.post("/", authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createQuizHandler);

export default router;
