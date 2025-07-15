import { Router } from "express";
import { createQuizHandler } from "./quiz.controller";

const router = Router();

/**
 * @route POST /
 * @group Quiz - Operations related to quizzes
 * @description Creates a new quiz with the provided data.
 * @returns {Quiz} 201 - Successfully created quiz
 */
router.post("/", createQuizHandler);

export default router;
