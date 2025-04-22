import { prisma } from '../../config/prisma';

export const findAIResponse = async (type: string, prompt: string) => {
  try {
    return await prisma.aIResponse.findFirst({
      where: {
        type,
        prompt,
      }
    })
  } catch (error) {
    throw new Error('Error fetching AI response');
  }
}

export  const saveAIResponse = async (type: string, prompt: string, response: string, topic?: string) => {
  try {
    return await prisma.aIResponse.create({
      data: {
        type,
        prompt,
        response,
        topic: topic || '',
      }
    })
  } catch (error) {
    throw new Error('Error saving AI response');
  }
}