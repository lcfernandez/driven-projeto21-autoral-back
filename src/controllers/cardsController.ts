import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authValidationMiddleware";
import { cardsService } from "../services/cardsService";

export async function create(req: AuthenticatedRequest, res: Response) {
  const { title, lane_id } = req.body;

  try {
    const result = await cardsService.create(title,lane_id, req.userId);

    res.status(201).send(result);
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

export async function remove(req: AuthenticatedRequest, res: Response) {
  const id = Number(req.params.id);
  
  try {
    await cardsService.remove(id, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "CardNotFoundError") {
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
    await cardsService.update(id, title, req.userId);

    res.sendStatus(200);
  } catch (err) {
    if (err.name === "CardNotFoundError") {
      return res.status(404).send(err.message);
    }
    if (err.name === "ForbiddenError") {
      return res.status(403).send(err.message);
    }
    
    res.sendStatus(400);
  }
}
