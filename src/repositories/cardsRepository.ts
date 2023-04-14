import { prisma } from "../configs/database.js";

async function create(title: string, laneId: number) {
  await prisma.cards.create({ data: { title, position: 0, lane_id: laneId } });
}

/* async function findAll(projectId: number) {
  return await prisma.lanes.findMany({
    where: { project_id: projectId },
    include: { cards: true },
    orderBy: { created_at: "desc" }
  });
}*/

async function findById(id: number) {
  return await prisma.cards.findUnique({ where: { id },
    include: {
      lanes: {
        include: {
          projects: true
        }
      }
    }
  });
}

async function remove(id: number) {
  await prisma.cards.delete({ where: { id } });
}

async function update(id: number, title: string) {
  await prisma.cards.update({ where: { id }, data: { title } });
}

export const cardsRepository = {
  create,
  //findAll,
  findById,
  remove,
  update
};
