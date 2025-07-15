import { prisma } from "../../config/prisma"
import { createQuizDTO } from "./quiz.dto";

export const createQuiz = async (data: createQuizDTO) => {
  try {
    return await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description || undefined,
        courseId: data.courseId,
        questions: {
          //map()	Fast and synchronous. Not a performance concern.
          create: data.questions.map(question => ({
            text: question.text,
            options: {
              create: question.options.map((option, index) => ({
                text: option.text,
                isCorrect: index === question.correctOptionIndex

              }))
            }
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })
  } catch (error: any) {
    throw new Error(error);
  }
}