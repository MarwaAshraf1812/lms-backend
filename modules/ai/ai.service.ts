import { findAIResponse, saveAIResponse } from './ai.dao';
import { generateQuizOrContent } from '../../utils/ai';

export const getOrCreateAIResult = async (type: "quiz" | "summary" | "resources", topic: string) => {
  try {
    return await generateQuizOrContent(topic, type);
  } catch (error) {
    throw new Error('Error fetching or creating AI result');
    
  }
}