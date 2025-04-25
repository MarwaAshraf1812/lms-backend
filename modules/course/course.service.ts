import {
  createCourseSchema,
  CreateModuleData,
  createModuleSchema,
  UpdateModuleData,
  updateModuleSchema,
} from "./course.dto";
import {
  createCourse,
  getAllCourses,
  createModule,
  enrollUserCourse,
  isUserEnrolled,
  getPopularCourses,
  filterCourses,
  updateModule
} from "./course.dao";
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
  });
};
export const handleCreateModule = async (data: CreateModuleData) => {
  const validatedData = createModuleSchema.parse(data);
  return await createModule(validatedData);
};

export const handleUpdateModule = async (data: UpdateModuleData, module_id:string) => {
  const validatedData = updateModuleSchema.parse(data);
  return await updateModule(validatedData, module_id);
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
