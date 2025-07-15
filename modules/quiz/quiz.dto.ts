// import { z } from "zod";
// import { createQuizSchema } from "./quiz.validation";

export interface createOptionDTO {
  text: string;
}

export interface createQuestionDTO {
  text: string;
  options: createOptionDTO[];
  correctOptionIndex: number;
}

export interface createQuizDTO {
  title: string;
  description?: string;
  courseId: string;
  questions: createQuestionDTO[];
}

// export type CreateQuizDTO = z.infer<typeof createQuizSchema>;