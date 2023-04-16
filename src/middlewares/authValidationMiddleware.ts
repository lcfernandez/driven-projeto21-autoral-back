import { NextFunction, Request, Response } from "express";
import { prisma } from "../configs/database";
import { signInSchema, signUpSchema } from "../schemas/authenticationSchemas";
import { unauthorizedError } from "../errors";
import jwt from "jsonwebtoken";

function generateUnauthorizedResponse(res: Response) {
  res.status(401).send(unauthorizedError());
}

type JWTPayload = {
  userId: number;
};

export type AuthenticatedRequest = Request & JWTPayload;

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) return generateUnauthorizedResponse(res);

  const token = authHeader.split(" ")[1];
  if (!token) return generateUnauthorizedResponse(res);

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.users.findFirst({
      where: {
        token,
      },
    });

    if (!session) return generateUnauthorizedResponse(res);

    req.userId = userId;
    
    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

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
