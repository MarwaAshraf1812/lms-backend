import { Request, Response } from "express";
import {
  handleCreateCourse,
  handleCreateModule,
  handleGetCourses,
  handleEnrollment,
  handleGetPopularCourses,
  handleFilterCourses,
  handleUpdateModule,
} from "./course.service";

export const createCourseHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id as string;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
    }
    const course = await handleCreateCourse(req.body, userId);
    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const createModuleHandler = async (req: Request, res: Response) => {
  try {
    const module = await handleCreateModule(req.body);
    res.status(201).json(module);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateModuleHandler = async (req: Request, res: Response) => {
  console.log(req.query.module_id, req.body)
  try {
    const module_id = req.query.module_id as string | undefined;
    if (!module_id) {
      res.status(400).json({ error: "Module ID is required" });
      return;
    }
    const module = await handleUpdateModule(req.body, module_id);
    res.status(200).json(module);
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCoursesHandler = async (req: Request, res: Response) => {
  try {
    const courses = await handleGetCourses(req.query);
    if (!courses) {
      res.status(404).json({ error: "No courses found" });
      return;
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const enrollUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const courseId = req.body.courseId;
    if (!userId || !courseId) {
      res.status(400).json({ error: "User ID and Course ID are required" });
      return;
    }
    const enrollment = await handleEnrollment(userId, courseId);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPopularCoursesHandler = async (req: Request, res: Response) => {
  try {
    const popularCourses = await handleGetPopularCourses();
    res.status(200).json(popularCourses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const filterCoursesHandler = async (req: Request, res: Response) => {
  try {
    const { search, category, level } = req.query;

    const courses = await handleFilterCourses({
      search: search as string,
      category: category as string,
      level: level as string,
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
