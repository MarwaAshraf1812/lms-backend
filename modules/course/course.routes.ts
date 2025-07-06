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
  GetUserEnrollmentsHandler,
  updateCourseStatusHandler,
  markEnrollmentAsCompedHandler
} from './course.controller';

import { authMiddleware, roleMiddleware } from '../auth/auth.middleware';

const router = Router();

// 🔥 Popular & filtered
router.get('/filter', filterCoursesHandler);
router.get('/popular', getPopularCoursesHandler);

// 🔐 Protected routes for admins/teachers
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createCourseHandler);
router.get('/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR', 'STUDENT']), getCourseByIdHandler)
router.delete('/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), deleteCourseHandler);
router.put('/visability/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateCourseVisabilityHandler);
router.post('/module', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createModuleHandler);
router.put('/module/:module_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateModuleHandler);
router.delete('/module/:module_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), deleteModuleHandler);
router.put('/status/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateCourseVisabilityHandler);

// 📚 Public/student routes
router.get('/', getCoursesHandler);
router.post('/enroll', authMiddleware, roleMiddleware(['STUDENT']), enrollUserHandler);
router.post('/rate/:course_id', authMiddleware, roleMiddleware(['STUDENT']), rateCourseHandler);
router.get('/enrollments', authMiddleware, roleMiddleware(['STUDENT']), GetUserEnrollmentsHandler);
router.put('/status/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateCourseStatusHandler);
router.put('/mark-completed/:enrollment_id', authMiddleware, roleMiddleware(['STUDENT']), markEnrollmentAsCompedHandler);

export default router;
