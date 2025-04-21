import { aiQuizSuggestionHandler } from './ai.controller';
import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.post('/ai/suggest', authMiddleware, aiQuizSuggestionHandler);

export default router;
