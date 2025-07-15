import {getOrCreateAIResult} from './ai.service';
import {Request, Response} from 'express';

export const aiQuizSuggestionHandler = async (req: Request, res: Response) => {
  try {
    const {topic , type} = req.body;
    if (!topic || !type) {
      res.status(400).json({error: "Topic and type are required"});
      return;
    }

    const result = await getOrCreateAIResult(topic, type);
    res.status(200).json({result});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error});
  }
}
