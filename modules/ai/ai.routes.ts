import { aiQuizSuggestionHandler } from './ai.controller';
import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../auth/auth.middleware';

const router = Router();

router.post('/suggest', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), aiQuizSuggestionHandler);

export default router;
