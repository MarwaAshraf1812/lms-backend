import { AIContentType } from '../types/ai';
import { findAIResponse, saveAIResponse } from './../modules/ai/ai.dao';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuizOrContent = async (topic: string, type: AIContentType) => {
  const promptMap = {
    quiz: `Generate 20 MCQ quiz questions with 4 choices and answers about: ${topic}`,
    summary: `Summarize this concept in simple terms: ${topic}`,
    resources: `Suggest online resources to learn more about: ${topic}`,
  };

  const prompt = promptMap[type];

  // ✅ Check cache BEFORE generating
  const cached = await findAIResponse(type, prompt);
  if (cached) return cached.response;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const response = completion.choices[0].message.content || 'No response from AI';

  await saveAIResponse(type, prompt, response);

  return response;
};

