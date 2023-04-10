import { NextFunction, Request, Response } from "express";
import { signInSchema, signUpSchema } from "../schemas/authenticationSchemas.js";

export function signInSchemaValidation(req: Request, res: Response, next: NextFunction) {
  const { error } = signInSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).send(
      error.details.map(
        detail => detail.message
      )
    );
  }

  next();
}

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
