import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authValidationMiddleware";
import { imagesService } from "../services/imagesService.js";

export async function create(req: AuthenticatedRequest, res: Response) {
  const { url, moodboard_id } = req.body;

  try {
    await imagesService.create(url, moodboard_id, req.userId);

    res.sendStatus(201);
  } catch (err) {
    if (err.name === "MoodboardNotFoundError") {
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
    await imagesService.remove(id, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "ImageFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}
