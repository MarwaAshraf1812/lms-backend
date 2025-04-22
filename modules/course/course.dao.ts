import { prisma } from "../../config/prisma";
import redis from "../../config/redis";

const POPULAR_COURSES_KEY = "popular_courses";

export const createCourse = async (data: {
  title: string;
  description: string;
  category: string;
  level: string;
  language: string;
  createdById: string;
}) => {
  try {
    return prisma.course.create({ data });
  } catch (error) {
    throw new Error("Error creating course");
  }
};

export const getAllCourses = async (
  {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    title,
  } : {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    title?: string;
  }
) => {
  try {
    const skip = (page - 1) * limit;
    const where = title
      ? { title: { contains: title, mode: "insensitive" } } as const
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
      },
    });

    const totalCourses = await prisma.course.count({ where });
    const totalPages = Math.ceil(totalCourses / limit);
    return {
      courses,
      totalCourses,
      totalPages
    }
  } catch (error) {
    throw new Error("Error fetching courses");
  }
};

export const createModule = async (data: {
  courseId: string;
  title: string;
  content: string;
  order: number;
}) => {
  try {
    return await prisma.module.create({ data });
  } catch (error) {
    throw new Error("Error creating module");
  }
};

export const enrollUserCourse = async (userId: string, courseId: string) => {
  try {
    return prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  } catch (error) {
    throw new Error("Error enrolling user in course");
  }
};

export const isUserEnrolled = async (userId: string, courseId: string) => {
  try {
    return prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  } catch (error) {
    throw new Error("Error checking user enrollment");
  }
};

export const getPopularCourses = async () => {
  try {
    const cachedCourses = await redis.get(POPULAR_COURSES_KEY);
    if (cachedCourses) {
      return JSON.parse(cachedCourses);
    }

    const popularCourses = await prisma.course.findMany({
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: 10,
    });

    await redis.set(POPULAR_COURSES_KEY, JSON.stringify(popularCourses), {
      EX: 60, // Cache for 1 minute
    });

    return popularCourses;
  } catch (error) {
    throw new Error("Error fetching popular courses");
  }
};

export const filterCourses = async (query: {
  search?: string;
  category?: string;
  level?: string;
}) => {
  const { search, category, level } = query;

  return await prisma.course.findMany({
    where: {
      AND: [
        search ? { title: { contains: search, mode: "insensitive" } } : {},
        category ? { category } : {},
        level ? { level } : {},
      ],
    },
  })
}