import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authValidationMiddleware";
import { lanesService } from "../services/lanesService";

export async function create(req: AuthenticatedRequest, res: Response) {
  const { title, project_id } = req.body;

  try {
    const result = await lanesService.create(title, project_id, req.userId);

    res.status(201).send(result);
  } catch (err) {
    if (err.name === "ProjectNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    if (err.name === "DuplicatedLaneError") {
      return res.status(409).send(err.message);
    }
    
    res.sendStatus(400);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  
  try {
    await lanesService.remove(id, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "LaneNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}

export async function update(req: AuthenticatedRequest, res: Response) {
  const { title } = req.body;
  const id = Number(req.params.id);

  try {
    await lanesService.update(id, title, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "LaneNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "DuplicatedLaneError") {
      return res.status(409).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}
