import { forbiddenError, imageNotFoundError, moodboardNotFoundError, projectNotFoundError } from "../errors.js";
import { imagesRepository } from "../repositories/imagesRepository.js";
import { moodboardRepository } from "../repositories/moodboardRepository.js";
import { projectRepository } from "../repositories/projectsRepository.js";

async function create(url: string, moodboardId: number, userId: number) {
  const moodboardExists = await moodboardRepository.findById(moodboardId);
  
  if (!moodboardExists) throw moodboardNotFoundError();

  if (moodboardExists.projects.user_id !== userId) throw forbiddenError();
  
  await imagesRepository.create(url, moodboardId);
}

async function findAll(projectId: number, userId: number) {
  if (isNaN(projectId)) throw projectNotFoundError();

  const projectExists = await projectRepository.findById(projectId);
  
  if (!projectExists) throw projectNotFoundError();
  
  if (projectExists.user_id !== userId) throw forbiddenError();
  
  const moodboard = await moodboardRepository.findByProjectId(projectId);

  const images = await imagesRepository.findAll(moodboard[0].id);

  return { project_name: projectExists.name, moodboard_id: moodboard[0].id, images };
}

async function remove(id: number, userId: number) {
  if (isNaN(id)) throw imageNotFoundError();

  const imageExists = await imagesRepository.findById(id);
  
  if (!imageExists) throw imageNotFoundError();

  if (imageExists.moodboards.projects.user_id !== userId) throw forbiddenError();

  await imagesRepository.remove(id);
}

export const imagesService = {
  create,
  findAll,
  remove
};
