import { prisma } from "../configs/database.js";

async function create(url: string, moodboardId: number) {
  await prisma.moodboards_images.create({ data: { url, pos_x: 0, pos_y: 0, high: 0, width: 0, moodboard_id: moodboardId } });
}

async function findAll(moodboardId: number) {
  return await prisma.moodboards_images.findMany({ where: { moodboard_id: moodboardId } });
}

async function findById(id: number) {
  return await prisma.moodboards_images.findUnique({
    where: { id }, include: {
      moodboards: {
        select: {
          projects: true
        }
      }
    }
  });
}

async function remove(id: number) {
  await prisma.moodboards_images.delete({ where: { id } });
}

export const imagesRepository = {
  create,
  findAll,
  findById,
  remove
};
