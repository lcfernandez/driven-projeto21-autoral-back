import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authValidationMiddleware";
import { projectsService } from "../services/projectsService.js";
import { imagesService } from "../services/imagesService.js";
import { lanesService } from "../services/lanesService.js";

export async function create(req: AuthenticatedRequest, res: Response) {
  const { name } = req.body;

  try {
    await projectsService.create(name, req.userId);

    res.sendStatus(201);
  } catch (err) {
    if (err.name === "DuplicatedProjectError") {
      return res.status(409).send(err.message);
    }
    
    res.sendStatus(400);
  }
}

export async function findAll(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await projectsService.findAll(req.userId);

    res.status(200).send(result);
  } catch (err) {
    res.sendStatus(400);
  }
}

export async function getLanes(req: AuthenticatedRequest, res: Response) {
  const projectId = Number(req.params.id);
  
  try {
    const lanes = await lanesService.findAll(projectId, req.userId);

    res.status(200).send(lanes);
  } catch (err) {
    if (err.name === "ProjectNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}

export async function getMoodboard(req: AuthenticatedRequest, res: Response) {
  const projectId = Number(req.params.id);
  
  try {
    const moodboard = await imagesService.findAll(projectId, req.userId);

    res.status(200).send(moodboard);
  } catch (err) {
    if (err.name === "ProjectNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  
  try {
    await projectsService.remove(id, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "ProjectNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const { name } = req.body;
  const id = Number(req.params.id);
  
  try {
    await projectsService.update(id, name, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "ProjectNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    if (err.name === "DuplicatedProjectError") {
      return res.status(409).send(err.message);
    }
    
    res.sendStatus(400);
  }
}
