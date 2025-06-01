import { prisma } from "../../config/prisma";
import { findUserById } from "../user/user.dao";
import { getCourseById } from "./dao/course.dao";
export const updateCourseRating = async (courseId: string) => {
  {
    try {
      const { _sum, _count } = await prisma.courseRating.aggregate({
        where: { courseId },
        _sum: { rating: true },
        _count: true,
      });

      const averageRating = (_sum.rating ?? 0) / _count;
      await prisma.course.update({
        where: { id: courseId },
        data: {
          rate: averageRating,
        },
      });
      return { averageRating, totalRatings: _count };
    } catch (error) {
      console.error(error);
      throw new Error("Error updating course rating");
    }
  }
};

export const getUserCourseRating = async (userId: string, courseId: string) => {
  try {
    return await prisma.courseRating.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user course rating");
  }
};

export const createCourseRating = async (
  userId: string,
  courseId: string,
  rating: number,
  comment?: string
) => {
  return prisma.courseRating.create({
    data: {
      userId,
      courseId,
      rating,
      comment: comment ?? "This course is great!",
    },
  });
};

export const isUserRatedCourse = async (userId: string, courseId: string) => {
  try {
    const rating = await prisma.courseRating.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    return !!rating;
  } catch (error) {
    console.error(error);
    throw new Error("Error checking if user has rated course");
  }
};

export const rateCourse = async (
  userId: string,
  courseId: string,
  rate: number,
  comment?: string
) => {
  try {
    await findUserById(userId);
    await getCourseById(courseId);
    const existingRating = await getUserCourseRating(userId, courseId);

    if (existingRating) throw new Error("User has already rated this course");

    const newRating = await createCourseRating(userId, courseId, rate, comment);
    const { averageRating, totalRatings } = await updateCourseRating(courseId);

    return {
      averageRating,
      totalRatings,
      userRating: newRating,
      message: "Course rated successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error rating course");
  }
};
