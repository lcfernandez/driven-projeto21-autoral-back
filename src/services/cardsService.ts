import { cardNotFoundError, forbiddenError, laneNotFoundError } from "../errors";
import { cardsRepository } from "../repositories/cardsRepository";
import { lanesRepository } from "../repositories/lanesRepository";

async function create(title: string, laneId: number, userId: number) {
  const laneExists = await lanesRepository.findById(laneId);
  
  if (!laneExists) throw laneNotFoundError();

  if (laneExists.projects.user_id !== userId) throw forbiddenError();
  
  return await cardsRepository.create(title, laneId);
}

async function remove(id: number, userId: number) {
  if (isNaN(id)) throw cardNotFoundError();

  const cardExists = await cardsRepository.findById(id);
  
  if (!cardExists) throw cardNotFoundError();

  if (cardExists.lanes.projects.user_id !== userId) throw forbiddenError();

  await cardsRepository.remove(id);
}

async function update(id: number, title: string, userId: number) {
  if (isNaN(id)) throw cardNotFoundError();

  const cardExists = await cardsRepository.findById(id);
  
  if (!cardExists) throw cardNotFoundError();

  if (cardExists.lanes.projects.user_id !== userId) throw forbiddenError();
  
  await cardsRepository.update(id, title);
}

export const cardsService = {
  create,
  remove,
  update
};
