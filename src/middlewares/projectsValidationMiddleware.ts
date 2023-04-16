import { NextFunction, Request, Response } from "express";
import { projectsSchema } from "../schemas/projectsSchemas";

export function projectsSchemaValidation(req: Request, res: Response, next: NextFunction) {
  const { error } = projectsSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).send(
      error.details.map(
        detail => detail.message
      )
    );
  }

  next();
}
