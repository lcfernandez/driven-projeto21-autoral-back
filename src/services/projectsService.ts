import { duplicatedProjectError, forbiddenError, projectNotFoundError } from "../errors.js";
import { projectRepository } from "../repositories/projectsRepository.js";

async function create(name: string, userId: number) {
  const projectNameExists = await projectRepository.findByName(name, userId);
  
  if (projectNameExists) throw duplicatedProjectError();
  
  await projectRepository.create(name, userId);
}

async function remove(id: number, userId: number) {
  if (isNaN(id)) throw projectNotFoundError();

  const projectExists = await projectRepository.findById(id);
  
  if (!projectExists) throw projectNotFoundError();

  if (projectExists.user_id !== userId) throw forbiddenError();

  await projectRepository.remove(id);
}

async function update(id: number, name: string, userId: number) {
  if (isNaN(id)) throw projectNotFoundError();

  const projectExists = await projectRepository.findById(id);
  
  if (!projectExists) throw projectNotFoundError();

  if (projectExists.user_id !== userId) throw forbiddenError();

  const projectNameExists = await projectRepository.findByName(name, userId);
  
  if (projectNameExists) throw duplicatedProjectError();
  
  await projectRepository.update(id, name);
}

export const projectsService = {
  create,
  remove,
  update
};
