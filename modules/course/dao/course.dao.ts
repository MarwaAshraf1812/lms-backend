import { prisma } from "../../../config/prisma";
import {
  FILTERED_COURSES_KEY,
  POPULAR_COURSES_KEY,
} from "../../../types/constants/cacheKeys";
import { getCachedData, setCachedData } from "../../../cache/cache";

export const createCourse = async (data: {
  title: string;
  description: string;
  categoryId: string;
  level: string;
  language: string;
  createdById: string;
}) => {
  try {
    const course = await prisma.course.create({
      data,
      include: {
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
        modules: true,
      },
    });

    return course;
  } catch (error) {
    throw new Error("Error creating course");
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    return await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            moduleContent: true,
          },
        },
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Error fetching course");
  }
};

export const getAllCourses = async ({
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  title,
}: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  title?: string;
}) => {
  try {
    const skip = (page - 1) * limit;
    const where = title
      ? ({ title: { contains: title, mode: "insensitive" } } as const)
      : {};
    const courses = await prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        modules: true,
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    const totalCourses = await prisma.course.count({ where });
    const totalPages = Math.ceil(totalCourses / limit);
    return {
      courses,
      totalCourses,
      totalPages,
    };
  } catch (error) {
    throw new Error("Error fetching courses");
  }
};

export const updateCourseVisability = async (
  courseId: string,
  isVisible: boolean
) => {
  try {
    return await prisma.course.update({
      where: { id: courseId },
      data: {
        hidden: isVisible,
      },
      include: {
        modules: {
          include: {
            moduleContent: true,
          },
        },
        createdBy: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Error updating course visibility");
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: {
              moduleContent: true,
            },
          },
        },
      });

      if (!course) {
        throw new Error("Course not found");
      }

      await tx.moduleContent.deleteMany({
        where: { moduleId: { in: course.modules.map((module) => module.id) } },
      });
      await tx.module.deleteMany({ where: { courseId } });
      return await tx.course.delete({
        where: { id: courseId },
      });
    });
  } catch (error) {
    throw new Error("Error deleting course");
  }
};

export const getPopularCourses = async () => {
  try {
    const cachedCourses = await getCachedData(POPULAR_COURSES_KEY);
    if (cachedCourses) return cachedCourses;
    console.log("Cache miss for filtered courses");

    const popularCourses = await prisma.course.findMany({
      orderBy: [
        {
          enrollments: {
            _count: "desc",
          },
        },
        {
          rate: "desc",
        },
      ],
      take: 10,
    });

    await setCachedData(POPULAR_COURSES_KEY, popularCourses, 60);

    return popularCourses;
  } catch (error) {
    throw new Error("Error fetching popular courses");
  }
};

export const getCategoryByName = async (categoryName: string) => {
  try {
    return await prisma.category.findUnique({
      where: { name: categoryName },
    });
  } catch (error) {
    throw new Error("Error fetching category");
  }
};

export const filterCourses = async (query: {
  search?: string;
  category?: string;
  level?: string;
}) => {
  try {
    const filters: any = {};

    const cashedCourses = await getCachedData(FILTERED_COURSES_KEY);
    if (cashedCourses) return cashedCourses;
    console.log("Cache miss for filtered courses");

    if (query.category) {
      const categoryData = await getCategoryByName(query.category);
      console.log(categoryData);
      if (categoryData) {
        filters.categoryId = categoryData.id;
      } else {
        return "No category found";
      }
    }

    if (query.search) {
      filters.title = { contains: query.search, mode: "insensitive" };
    }
    if (query.level) {
      filters.level = query.level;
    }

    const courses = await prisma.course.findMany({
      where: filters,
    });

    await setCachedData(FILTERED_COURSES_KEY, courses, 60);
    console.log("Filtered courses cached");

    return courses;
  } catch (error) {
    console.error(error);
    throw new Error("Error filtering courses");
  }
};
