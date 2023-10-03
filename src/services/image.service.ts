import { Request, Response } from "express";
import { PostgresError } from "postgres";
import { logger } from "../config/logger";

const create = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      logger.error("No images upload");
      res.status(400).json({ error: "Please upload images" });
      return;
    }

    const imageUrls = (req.files as Express.MulterS3.File[]).map(
      (file: Express.MulterS3.File) => {
        return `https://stagingfs.uploadje.com/${file.key}`;
      },
    );
    
    logger.info(`Image created by ${res.locals.user.id}`);
    
    res.status(201).json({ message: "Image uploaded!", imageUrls });
  } catch (err) {
    if (err instanceof PostgresError) {
      logger.error(err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    logger.error(err);
    res.status(400).json({ error: "Something went wrong" });
  }
};

export const imageService = {
  create,
};
