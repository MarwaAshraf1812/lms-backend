import { prisma } from "../../../config/prisma";

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

export const getUserEnrollments = async (userId: string) => {
  try {
    return prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Error fetching user enrollments");
  }
}