import { Router } from 'express';
import {
  createCourseHandler,
  createModuleHandler,
  getCoursesHandler,
  enrollUserHandler,
  getPopularCoursesHandler,
  filterCoursesHandler,
  updateModuleHandler,
  getCourseByIdHandler,
  updateCourseVisabilityHandler,
  deleteCourseHandler,
  deleteModuleHandler,
  rateCourseHandler,
  GetUserEnrollmentsHandler
} from './course.controller';

import { authMiddleware, roleMiddleware } from '../auth/auth.middleware';

const router = Router();

// 🔥 Popular & filtered
router.get('/filter', filterCoursesHandler);
router.get('/popular', getPopularCoursesHandler);

// 🔐 Protected routes for admins/teachers
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createCourseHandler);
router.get('/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), getCourseByIdHandler)
router.delete('/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), deleteCourseHandler);
router.put('/visability/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateCourseVisabilityHandler);
router.post('/module', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createModuleHandler);
router.put('/module/:module_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateModuleHandler);
router.delete('/module/:module_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), deleteModuleHandler);

// 📚 Public/student routes
router.get('/', getCoursesHandler);
router.post('/enroll', authMiddleware, roleMiddleware(['STUDENT']), enrollUserHandler);
router.post('/rate/:course_id', authMiddleware, roleMiddleware(['STUDENT']), rateCourseHandler);
router.get('/enrollments', authMiddleware, roleMiddleware(['STUDENT']), GetUserEnrollmentsHandler);

export default router;
