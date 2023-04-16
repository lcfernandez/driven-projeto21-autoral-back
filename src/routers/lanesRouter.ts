import { Router } from "express";
import { create, remove, update } from "../controllers/lanesController";
import { lanesSchemaValidation } from "../middlewares/lanesValidationMiddleware";

export const lanesRouter = Router();

lanesRouter.delete("/lanes/:id", remove);
lanesRouter.post("/lanes", lanesSchemaValidation, create);
lanesRouter.put("/lanes/:id", lanesSchemaValidation, update);
