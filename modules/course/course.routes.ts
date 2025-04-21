import { Router } from 'express';
import {
  createCourseHandler,
  createModuleHandler,
  getCoursesHandler,
} from './course.controller';
import { authMiddleware, roleMiddleware } from '../auth/auth.middleware';
const router = Router();

router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'TEACHER']), createCourseHandler);
router.post('/module', authMiddleware, roleMiddleware(['ADMIN', 'TEACHER']), createModuleHandler);
router.get('/', authMiddleware, getCoursesHandler);

export default router;
