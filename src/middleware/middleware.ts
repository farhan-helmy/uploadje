import { Schema, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { logger } from "../config/logger";
import { selectSecret } from "../repository/secret.repository";
import { selectApp, selectAppForAuth } from "../repository/app.repository";

export const validateBody = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: err.errors });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
};

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract the token part without "Bearer " prefix
  const token = authHeader.replace("Bearer ", "");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.locals.user = user as JwtPayload;

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const validateApp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uploadjeAppKeyHeader = req.header("UPLOADJE_APP_ID");
  const uploadjeAppSecretHeader = req.header("UPLOADJE_APP_SECRET");

  try {
    const app = await selectAppForAuth(uploadjeAppKeyHeader!);

    if (!app) {
      logger.error(`Application key ${uploadjeAppKeyHeader} not authorized to upload or not exists`);
      res.status(401).json({
        error:
          `Application key ${uploadjeAppKeyHeader} not authorized to upload or not exists`,
      });
      return;
    }
    const appResult = await selectSecret(
      app?.id!,
      uploadjeAppSecretHeader!,
    );


    if (!appResult) {
      logger.error(`Application key ${uploadjeAppKeyHeader} not authorized to upload or not exists`);
      res.status(401).json({
        error:
          `Application secret ${uploadjeAppSecretHeader} not exists`,
      });
      return;
    }

    res.locals.app = appResult as JwtPayload;

    next();
  } catch (err) {
    console.log(err)
    logger.error("Application not authorized to upload");
    res.status(401).json({
      error:
        err,
    });
  }
};
