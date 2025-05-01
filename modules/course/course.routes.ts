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
} from './course.controller';

import { authMiddleware, roleMiddleware } from '../auth/auth.middleware';

const router = Router();

// 🔐 Protected routes for admins/teachers
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createCourseHandler);
router.get('/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), getCourseByIdHandler)
router.delete('/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), deleteCourseHandler);
router.put('/visability/:course_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateCourseVisabilityHandler);
router.post('/module', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), createModuleHandler);
router.put('/module/:module_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), updateModuleHandler);
router.delete('/module/:module_id', authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']), deleteModuleHandler);

// 📚 Public/student routes
router.get('/', authMiddleware, getCoursesHandler);
router.post('/enroll', authMiddleware, roleMiddleware(['STUDENT']), enrollUserHandler);

// 🔥 Popular & filtered
router.get('/popular', authMiddleware, getPopularCoursesHandler);
router.get('/filter', authMiddleware, filterCoursesHandler);


// 🔥 instructors/students dashboards
// router.get('/dashboard', authMiddleware, roleMiddleware('INSTRUCTOR']), getDashboardHandler);
// router.get('/dashboard/:user_id', authMiddleware, roleMiddleware(['STUDENT']), getDashboardHandler);
// router.get('/dashboard/:user_id/courses', authMiddleware, roleMiddleware(['STUDENT']), getDashboardCoursesHandler);
// router.get('/dashboard/:user_id/courses/:course_id', authMiddleware, roleMiddleware(['STUDENT']), getDashboardCourseHandler);
// router.get('/dashboard/:user_id/courses/:course_id/modules', authMiddleware, roleMiddleware(['STUDENT']), getDashboardModulesHandler);

export default router;
