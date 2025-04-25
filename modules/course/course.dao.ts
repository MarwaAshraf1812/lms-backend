import { prisma } from "../../config/prisma";
import redis from "../../config/redis";
import { CreateModuleData, UpdateModuleData } from "./course.dto";

const POPULAR_COURSES_KEY = "popular_courses";

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
          }
        },
        modules: true,
      }
    });

    return course;
  } catch (error) {
    throw new Error("Error creating course");
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
          }
        },
      }
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

export const createModule = async (data: CreateModuleData) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const module = await tx.module.create({
        data: {
          courseId: data.courseId,
          title: data.title,
          order: data.order,
        },
      });
    
    if (data.content && data.content.length > 0) {
      await tx.moduleContent.createMany({
        data: data.content.map((content) => ({
          ...content,
          moduleId: module.id,
        }))
      })
    }    
    return await tx.module.findUnique({
      where: { id: module.id },
      include: {
        moduleContent: true,
      }
    })
  })
  } catch (error) {
    throw new Error("Error creating module");
  }
};

export const updateModule = async (data: UpdateModuleData, module_id: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const updateModule = await tx.module.update({
        where: { id: module_id },
        data: {
          title: data.title,
          order: data.order,
        }
      })

      if (data.content) {
        await tx.moduleContent.deleteMany({ where : { moduleId: module_id} })
        await tx.moduleContent.createMany({
          data: data.content.map((content) => ({
            ...content,
            moduleId: updateModule.id,
          }))
        })
      }

      return await tx.module.findUnique({
        where: { id: updateModule.id },
        include: {
          moduleContent: true,
        }
      })
    })
  } catch (error) {
    throw new Error("Error updating module");
    
  }
}

export const deleteModule = async (moduleId : string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: moduleId },
        include: {
          moduleContent: true,
        }
      })

      if (!module) {
        throw new Error("Module not found");
      }
      await tx.moduleContent.deleteMany({ where: { moduleId } })
    })
  } catch (error) {
    throw new Error("Error deleting module");
    
  }
}

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
  categoryId?: string;
  level?: string;
}) => {
  try {
    const { search, categoryId, level } = query;

    return await prisma.course.findMany({
      where: {
        AND: [
          search ? { title: { contains: search, mode: "insensitive" } } : {},
          categoryId ? { categoryId } : {},
          level ? { level } : {},
        ],
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error filtering courses");
  }
};
