import { prisma } from "../configs/database.js";
import { moodboardRepository } from "./moodboardRepository.js";

async function create(name: string, userId: number) {
  const plannedStatus = await prisma.status.findFirst({ where: { name: "Planejamento" } });
  const { id } = await prisma.projects.create({ data: { name, user_id: userId, status_id: plannedStatus.id } });
  await prisma.moodboards.create({ data: { project_id: id } });
}

async function findAll(id: number) {
  return await prisma.projects.findMany({ where: { user_id: id }, orderBy: { created_at: "desc" } });
}

async function findById(id: number) {
  return await prisma.projects.findUnique({ where: { id } });
}

async function findByName(name: string, userId: number) {
  return await prisma.projects.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive"
      },
      user_id: userId
    }
  });
}

async function remove(id: number) {
  const moodboard = await moodboardRepository.findByProjectId(id);
  
  await prisma.moodboards_images.deleteMany({ where: { moodboard_id: moodboard.id } });
  await prisma.moodboards.deleteMany({ where: { project_id: id } });
  await prisma.cards.deleteMany({ where: { lanes: { project_id: id} } });
  await prisma.lanes.deleteMany({ where: { project_id: id } });
  await prisma.projects.delete({ where: { id } });
}

async function update(id: number, name: string) {
  await prisma.projects.update({ where: { id }, data: { name } });
}

export const projectRepository = {
  create,
  findAll,
  findById,
  findByName,
  remove,
  update
};
