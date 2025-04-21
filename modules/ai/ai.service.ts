import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuizOrContent = async (topic: string, type: 'quiz' | 'summary' | 'resources') => {
  const promptMap = {
    quiz: `Generate 3 MCQ quiz questions with 4 choices and answers about: ${topic}`,
    summary: `Summarize this concept in simple terms: ${topic}`,
    resources: `Suggest online resources to learn more about: ${topic}`,
  };

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: promptMap[type] }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
};
