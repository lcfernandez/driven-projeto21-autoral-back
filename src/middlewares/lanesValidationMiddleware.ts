import { NextFunction, Request, Response } from "express";
import { lanesSchema } from "../schemas/lanesSchemas";

export function lanesSchemaValidation(req: Request, res: Response, next: NextFunction) {
  const { error } = lanesSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).send(
      error.details.map(
        detail => detail.message
      )
    );
  }

  next();
}
