import {
  createCourseSchema,
  CreateModuleData,
  createModuleSchema,
  UpdateModuleData,
  updateModuleSchema,
} from "./course.validation";
import {
  createCourse,
  getAllCourses,
  getPopularCourses,
  filterCourses,
  getCourseById,
  updateCourseVisability,
  deleteCourse,
  updateCourseStatus,
} from "./dao/course.dao";
import { isUserRatedCourse, rateCourse } from "./courseRating.service";
import { deleteModule, createModule, updateModule } from "./dao/module.dao";
import { enrollUserCourse, getUserEnrollments, isUserEnrolled, markEnrollmentAsCompleted } from "./dao/enrollment.dao";
interface CreateCourseData {
  title: string;
  description: string;
}

export const handleCreateCourse = async (
  data: CreateCourseData,
  userId: string
) => {
  const validatedData = createCourseSchema.parse(data);
  return await createCourse({
    ...validatedData,
    createdById: userId,
    discountEnd: validatedData.discountEnd ? new Date(validatedData.discountEnd) : undefined,
  });
};

export const handleGetCourseById = async (courseId: string) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  return course;
};

export const handleUpdateCourseVisability = async (
  courseId: string,
  isVisible: boolean
) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  return await updateCourseVisability(courseId, isVisible);
};

export const handleDeleteCourse = async (courseId: string) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  return await deleteCourse(courseId);
};

export const handleCreateModule = async (data: CreateModuleData) => {
  const validatedData = createModuleSchema.parse(data);
  return await createModule(validatedData);
};

export const handleUpdateModule = async (
  data: UpdateModuleData,
  module_id: string
) => {
  const validatedData = updateModuleSchema.parse(data);
  return await updateModule(validatedData, module_id);
};

export const handleDeleteModule = async (moduleId: string) => {
  const module = await getCourseById(moduleId);
  if (!module) {
    throw new Error("Module not found");
  }
  return await deleteModule(moduleId);
};

export const handleGetCourses = async (query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const sort = query.sort || "createdAt";
  const order = query.order || "desc";
  const title = query.title || "";
  return await getAllCourses({
    page,
    limit,
    sort,
    order,
    title,
  });
};

export const handleEnrollment = async (userId: string, courseId: string) => {
  try {
    const isEnrolled = await isUserEnrolled(userId, courseId);
    if (isEnrolled) {
      return "User is already enrolled in this course";
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

export const handleRateCourse = async (
  userId: string,
  courseId: string,
  rate: number,
  comment?: string
) => {
  try {
    if (rate < 1 || rate > 5) {
      return { message: "Rating must be between 1 and 5" };
    }

    const isRated = await isUserRatedCourse(userId, courseId);
    if (isRated) {
      return { message: "User has already rated this course" };
    }
    return await rateCourse(userId, courseId, rate, comment);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const handleGetUserEnrollments = async (userId: string) => {
  try {
    return await getUserEnrollments(userId);
  } catch (error) {
    throw new Error("Error fetching user enrollments");
  }
}

export const handleUpdateCourseStatus = async (
  courseId: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
) => {
  const course = await getCourseById(courseId);
  if (!course) {
    return "Course not found";
  }
  if (course.status !== status) return "Course status is already set to this value";
  if (status === "PUBLISHED" && course.modules.length === 0) {
    return "Cannot publish a course without modules";
  }
  if (status === "DRAFT" && course.modules.length > 0) {
    return "Cannot set a course with modules to draft";
  }
  const enrollments = await getUserEnrollments(courseId);

  if (status === "ARCHIVED" && enrollments.length > 0) {
    return "Cannot archive a course with active enrollments";
  }
  return await updateCourseStatus(courseId, status);
}

export const handleMarkEnrollmentAsCompleted = async (
  userId: string,
  courseId: string
) => {
  try {
    // Check if the user is enrolled in the course
    const enrollment = await isUserEnrolled(userId, courseId);
    if (!enrollment) throw new Error("User is not enrolled in this course");
    
    return await markEnrollmentAsCompleted(userId, courseId);
  } catch (error) {
    throw new Error("Error marking enrollment as completed");
    
  }
}
