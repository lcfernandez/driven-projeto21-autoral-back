import { NextFunction, Request, Response } from "express";
import { imagesSchema } from "../schemas/imagesSchemas.js";

export function imagesSchemaValidation(req: Request, res: Response, next: NextFunction) {
  const { error } = imagesSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).send(
      error.details.map(
        detail => detail.message
      )
    );
  }

  next();
}
