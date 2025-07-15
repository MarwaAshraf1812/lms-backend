import { Request, Response } from "express";
import * as QuizService from "./quiz.service";
import { createQuizSchema } from "./quiz.validation";

export const createQuizHandler = async (req: Request, res: Response) => {
  try {
    console.log("Creating quiz with data:", req.body);
    const validatedData = createQuizSchema.parse(req.body);
    console.log("Validated data:", validatedData);
    const quiz = await QuizService.hanadleCreateQuiz(validatedData);
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Invalid quiz data",
        error: error.errors || error.message,
      });
  }
};
