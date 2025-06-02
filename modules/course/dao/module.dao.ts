import { prisma } from "../../../config/prisma";
import { CreateModuleData, UpdateModuleData } from "../course.validation";

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
          })),
        });
      }
      return await tx.module.findUnique({
        where: { id: module.id },
        include: {
          moduleContent: true,
        },
      });
    });
  } catch (error) {
    throw new Error("Error creating module");
  }
};

export const updateModule = async (
  data: UpdateModuleData,
  module_id: string
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const updateModule = await tx.module.update({
        where: { id: module_id },
        data: {
          title: data.title,
          order: data.order,
        },
      });

      if (data.content) {
        await tx.moduleContent.deleteMany({ where: { moduleId: module_id } });
        await tx.moduleContent.createMany({
          data: data.content.map((content) => ({
            ...content,
            moduleId: updateModule.id,
          })),
        });
      }

      return await tx.module.findUnique({
        where: { id: updateModule.id },
        include: {
          moduleContent: true,
        },
      });
    });
  } catch (error) {
    throw new Error("Error updating module");
  }
};

export const deleteModule = async (moduleId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: moduleId },
        include: {
          moduleContent: true,
        },
      });

      if (!module) {
        throw new Error("Module not found");
      }
      await tx.moduleContent.deleteMany({ where: { moduleId } });
    });
  } catch (error) {
    throw new Error("Error deleting module");
  }
};