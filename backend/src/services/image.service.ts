import { Request, Response } from "express";
import { PostgresError } from "postgres";
import { logger } from "../config/logger";
import {
  deleteImage,
  insertImage,
  selectImage,
  selectImages,
} from "../repository/image.repository";
import { s3Strategy } from "../strategy/s3";

const get = async (req: Request, res: Response) => {
  try {
    const images = await selectImage(res.locals.app.id, req.params.imageId);

    res.status(200).json(images);
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

const getAll = async (req: Request, res: Response) => {
  try {
    const images = await selectImages(res.locals.app.id);

    res.status(200).json(images);
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

const create = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      logger.error("No images upload");
      res.status(400).json({ error: "Please upload images" });
      return;
    }

    const imageData = (req.files as Express.MulterS3.File[]).map(
      (file: Express.MulterS3.File) => {
        return {
          url: `https://stagingfs.uploadje.com/${file.key}`,
          size: file.size,
          key: file.key,
        };
      },
    );

    for (const image of imageData) {
      try {
        await insertImage({
          path: image.url,
          size: image.size.toString(),
          appId: res.locals.app.id,
          key: image.key,
        });
        logger.info(`Image inserted successfully: ${image.url}`);
      } catch (err) {
        logger.error(`Error inserting image ${image.url}`);
      }
    }

    logger.info(`Image created by ${res.locals.app.id}`);

    res.status(201).json({ message: "Image uploaded!", imageData });
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

const remove = async (req: Request, res: Response) => {
  try {
    const image = await selectImage(res.locals.app.id, req.params.imageId);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    await s3Strategy.uploadJeStagingDelete(image.key);

    await deleteImage(image.id);

    return res.status(204).json();
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
  get,
  getAll,
  remove,
};
