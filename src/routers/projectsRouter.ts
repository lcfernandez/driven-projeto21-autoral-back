import { Router } from "express";
import { create, findAll, getMoodboard, remove, update } from "../controllers/projectsController.js";
import { projectsSchemaValidation } from "../middlewares/projectsValidationMiddleware.js";

export const projectsRouter = Router();

projectsRouter.delete("/projects/:id", remove);
projectsRouter.get("/projects", findAll);
projectsRouter.get("/projects/:id/moodboard", getMoodboard);
projectsRouter.post("/projects", projectsSchemaValidation, create);
projectsRouter.put("/projects/:id", projectsSchemaValidation, update);
