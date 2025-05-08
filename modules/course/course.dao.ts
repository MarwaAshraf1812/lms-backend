import { prisma } from "../../config/prisma";
import redis from "../../config/redis";
import { CreateModuleData, UpdateModuleData } from "./course.dto";

const POPULAR_COURSES_KEY = "popular_courses";
const FILTERED_COURSES_KEY = "filtered_courses";

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

export const getCourseById = async (courseId: string) => {
  try {
    return await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            moduleContent: true,
          }
        },
        createdBy: {
          select: {
            username: true,
            email: true,
          }
        },
      }
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

export const updateCourseVisability = async (courseId: string, isVisible: boolean) => {
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
          }
        },
        createdBy: {
          select: {
            username: true,
            email: true,
          } 
        },
      }
    })
  } catch (error) {
    throw new Error("Error updating course visibility");
    
  }
}

export const deleteCourse = async (courseId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: {
              moduleContent: true,
            }
          }
        }
      })

      if (!course) {
        throw new Error("Course not found");
      }

      await tx.moduleContent.deleteMany({ where: { moduleId: { in: course.modules.map((module) => module.id) } } })
      await tx.module.deleteMany({ where: { courseId } })
      return await tx.course.delete({
        where: { id: courseId },
      });
    })
  } catch (error) {
    throw new Error("Error deleting course");
    
  }
}

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

export const updateModule = async (data: UpdateModuleData, module_id: string)  => {
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
      console.log("Cache hit for popular courses");
      return JSON.parse(cachedCourses);
    }


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

    await redis.set(POPULAR_COURSES_KEY, JSON.stringify(popularCourses), {
      EX: 60, // Cache for 1 minute
    });
    console.log("Popular courses cached");

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

    const cashedCourses = await redis.get(FILTERED_COURSES_KEY);
    if (cashedCourses) {
      console.log("Cache hit for filtered courses");
      return JSON.parse(cashedCourses);
    }
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

    await redis.set(FILTERED_COURSES_KEY, JSON.stringify(courses), {
      EX: 60, // Cache for 1 minute
    });
    console.log("Filtered courses cached");

    return courses;
  } catch (error) {
    console.error(error);
    throw new Error("Error filtering courses");
  }
};

export const rateCourse = async (userId: string, courseId: string, rate: number) => {
  try {
    if (rate < 1 || rate > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new Error("Course not found");
    }

    // Check if the user has already rated the course
    const existingRating = await prisma.courseRating.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingRating) {
      throw new Error("User has already rated this course");
    }

    // Create a new rating
    const newRating = await prisma.courseRating.create({
      data: {
        userId,
        courseId,
        rating: rate,
      },
    });

    // Get the updated sum and count of ratings
    const { _sum, _count } = await prisma.courseRating.aggregate({
      where: { courseId },
      _sum: { rating: true },
      _count: true,
    });

    // Calculate the new average rating
    const averageRating = _sum.rating  ?? 0  / _count;

    // Update the course with the new average rating
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        rate: averageRating,
      },
    });

    return {
      ...updatedCourse,
      averageRating,
      totalRatings: _count,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error rating course");
  }
};

