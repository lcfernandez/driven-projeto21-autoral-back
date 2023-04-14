import { prisma } from "../configs/database.js";

async function create(title: string, projectId: number) {
  await prisma.lanes.create({ data: { title, position: 0, project_id: projectId } });
}

async function findAll(projectId: number) {
  return await prisma.lanes.findMany({
    where: { project_id: projectId },
    include: { cards: true },
    orderBy: { created_at: "desc" }
  });
}

async function findById(id: number) {
  return await prisma.lanes.findUnique({ where: { id },
    include: {
      projects: true
    }
  });
}

async function findByTitle(title: string, projectId: number) {
  return await prisma.lanes.findFirst({
    where: {
      title: {
        equals: title,
        mode: "insensitive"
      },
      project_id: projectId
    }
  });
}

async function remove(id: number) {
  // TODO: cards delete implementation
  await prisma.lanes.delete({ where: { id } });
}

async function update(id: number, title: string) {
  await prisma.lanes.update({ where: { id }, data: { title } });
}

export const lanesRepository = {
  create,
  findAll,
  findById,
  findByTitle,
  remove,
  update
};
