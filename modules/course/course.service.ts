import { createCourseSchema, createModuleSchema } from "./course.dto";
import {
  createCourse,
  getAllCourses,
  createModule,
  enrollUserCourse,
  isUserEnrolled,
  getPopularCourses,
  filterCourses
} from "./course.dao";
interface CreateCourseData {
  title: string;
  description: string;
}
interface CreateModuleData {
  courseId: string;
  title: string;
  content: string;
  order: number;
}

export const handleCreateCourse = async (
  data: CreateCourseData,
  userId: string
) => {
  const validatedData = createCourseSchema.parse(data);
  return await createCourse({
    ...validatedData,
    createdById: userId,
  });
};

export const handleCreateModule = async (data: CreateModuleData) => {
  const validatedData = createModuleSchema.parse(data);
  return await createModule(validatedData);
};

export const handleGetCourses = async () => {
  return await getAllCourses();
};

export const handleEnrollment = async (userId: string, courseId: string) => {
  try {
    const isEnrolled = await isUserEnrolled(userId, courseId);
    if (isEnrolled) {
      throw new Error("User is already enrolled in this course");
    }
    return await enrollUserCourse(userId, courseId);
  } catch (error) {
    throw new Error("Error enrolling user in course");
  }
};

export const handleGetPopularCourses = async () => {
  try {
    return await getPopularCourses();
  } catch (error) {
    throw new Error("Error fetching popular courses");
  }
};

export const handleFilterCourses = async (filters: any) => {
  try {
    return await filterCourses(filters);
  } catch (error) {
    throw new Error("Error filtering courses");
  }
};
