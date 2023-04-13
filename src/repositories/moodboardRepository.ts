import { prisma } from "../configs/database.js";

async function findById(id: number) {
  return await prisma.moodboards.findUnique({
    where: { id }, include: {
      projects: {
        select: {
          user_id: true,
        }
      }
    }
  });
}

async function findByProjectId(projectId: number) {
  return await prisma.moodboards.findMany({ where: { project_id: projectId }});
}

export const moodboardRepository = {
  findById,
  findByProjectId
};
