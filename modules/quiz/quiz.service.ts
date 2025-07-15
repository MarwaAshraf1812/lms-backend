import { createQuizDTO } from "./quiz.dto";
import * as QuizDAO from "./quiz.dao";


export const hanadleCreateQuiz = async (data: createQuizDTO) => {
  try {
    return await QuizDAO.createQuiz(data);
  } catch (error) {
    throw new Error("Failed to create quiz" + error);
  }
}
