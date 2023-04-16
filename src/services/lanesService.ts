import { duplicatedLaneError, forbiddenError, laneNotFoundError, projectNotFoundError } from "../errors";
import { lanesRepository } from "../repositories/lanesRepository";
import { projectRepository } from "../repositories/projectsRepository";

async function create(title: string, projectId: number, userId: number) {
  const projectExists = await projectRepository.findById(projectId);
  
  if (!projectExists) throw projectNotFoundError();

  if (projectExists.user_id !== userId) throw forbiddenError();

  const laneTitleExists = await lanesRepository.findByTitle(title, projectId);
  
  if (laneTitleExists) throw duplicatedLaneError();  
  
  return await lanesRepository.create(title, projectId);
}

async function findAll(projectId: number, userId: number) {
  if (isNaN(projectId)) throw projectNotFoundError();

  const projectExists = await projectRepository.findById(projectId);
  
  if (!projectExists) throw projectNotFoundError();
  
  if (projectExists.user_id !== userId) throw forbiddenError();

  return await lanesRepository.findAll(projectId);
}

async function remove(id: number, userId: number) {
  if (isNaN(id)) throw laneNotFoundError();

  const laneExists = await lanesRepository.findById(id);
  
  if (!laneExists) throw laneNotFoundError();

  if (laneExists.projects.user_id !== userId) throw forbiddenError();

  await lanesRepository.remove(id);
}

async function update(id: number, title: string, userId: number) {
  if (isNaN(id)) throw laneNotFoundError();

  const laneExists = await lanesRepository.findById(id);
  
  if (!laneExists) throw laneNotFoundError();

  if (laneExists.projects.user_id !== userId) throw forbiddenError();

  const laneTitleExists = await lanesRepository.findByTitle(title, laneExists.projects.id);
  
  if (laneTitleExists && laneTitleExists.id !== id) throw duplicatedLaneError();
  
  await lanesRepository.update(id, title);
}

export const lanesService = {
  create,
  findAll,
  remove,
  update
};
