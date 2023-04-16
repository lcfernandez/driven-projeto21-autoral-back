import { forbiddenError, imageNotFoundError, moodboardNotFoundError, projectNotFoundError } from "../errors";
import { imagesRepository } from "../repositories/imagesRepository";
import { moodboardRepository } from "../repositories/moodboardRepository";
import { projectRepository } from "../repositories/projectsRepository";

async function create(url: string, moodboardId: number, userId: number) {
  const moodboardExists = await moodboardRepository.findById(moodboardId);
  
  if (!moodboardExists) throw moodboardNotFoundError();

  if (moodboardExists.projects.user_id !== userId) throw forbiddenError();
  
  return await imagesRepository.create(url, moodboardId);
}

async function findAll(projectId: number, userId: number) {
  if (isNaN(projectId)) throw projectNotFoundError();

  const projectExists = await projectRepository.findById(projectId);
  
  if (!projectExists) throw projectNotFoundError();
  
  if (projectExists.user_id !== userId) throw forbiddenError();
  
  const moodboard = await moodboardRepository.findByProjectId(projectId);

  const images = await imagesRepository.findAll(moodboard.id);

  return { project_name: projectExists.name, moodboard_id: moodboard.id, images };
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
