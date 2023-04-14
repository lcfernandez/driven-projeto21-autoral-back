import { NextFunction, Request, Response } from "express";
import { cardsSchema } from "../schemas/cardsSchemas.js";

export function cardsSchemaValidation(req: Request, res: Response, next: NextFunction) {
  const { error } = cardsSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).send(
      error.details.map(
        detail => detail.message
      )
    );
  }

  next();
}
