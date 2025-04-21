import { Router } from 'express';
import {
  createCourseHandler,
  createModuleHandler,
  getCoursesHandler,
  enrollUserHandler,
  getPopularCoursesHandler,
  filterCoursesHandler,
} from './course.controller';

import { authMiddleware, roleMiddleware } from '../auth/auth.middleware';

const router = Router();

// 🔐 Protected routes for admins/teachers
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'TEACHER']), createCourseHandler);
router.post('/module', authMiddleware, roleMiddleware(['ADMIN', 'TEACHER']), createModuleHandler);

// 📚 Public/student routes
router.get('/', authMiddleware, getCoursesHandler);
router.post('/enroll', authMiddleware, roleMiddleware(['STUDENT']), enrollUserHandler);

// 🔥 Popular & filtered
router.get('/popular', authMiddleware, getPopularCoursesHandler);
router.get('/filter', authMiddleware, filterCoursesHandler);

export default router;
