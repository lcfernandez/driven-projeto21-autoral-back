import { Router } from "express";
import { create, findAll, getLanes, getMoodboard, remove, update } from "../controllers/projectsController";
import { projectsSchemaValidation } from "../middlewares/projectsValidationMiddleware";

export const projectsRouter = Router();

projectsRouter.delete("/projects/:id", remove);
projectsRouter.get("/projects", findAll);
projectsRouter.get("/projects/:id/moodboard", getMoodboard);
projectsRouter.get("/projects/:id/lanes", getLanes);
projectsRouter.post("/projects", projectsSchemaValidation, create);
projectsRouter.put("/projects/:id", projectsSchemaValidation, update);
