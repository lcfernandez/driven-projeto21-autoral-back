import { prisma } from "../configs/database.js";

async function create(name: string, userId: number) {
  const { id } = await prisma.projects.create({ data: { name, user_id: userId, status_id: 1 } });
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
  await prisma.moodboards.deleteMany({ where: { project_id: id } });
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
