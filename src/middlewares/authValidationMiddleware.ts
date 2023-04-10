import { NextFunction, Request, Response } from "express";
import { signUpSchema } from "../schemas/authenticationSchemas.js";

export function signUpSchemaValidation(req: Request, res: Response, next: NextFunction) {
  const { error } = signUpSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).send(
      error.details.map(
        detail => detail.message
      )
    );
  }

  next();
}
