import type { Request, Response } from "express";
import { PostgresError } from "postgres";
import { logger } from "../config/logger";
import { deleteSecret, selectSecrets, insertSecret } from "../repository/secret.repository";
import { selectApp } from "../repository/app.repository";
import { generateAppSecret } from "../utils/secret";

const getAll = async (req: Request, res: Response) => {
  try {
    const app = await selectApp(res.locals.user.id, req.params.appId);

    if (!app) {
      return res.status(200).json({ error: "App not found" });
    }

    const secrets = await selectSecrets(app.id);

    return res.status(200).json(secrets);
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
    const app = await selectApp(res.locals.user.id, req.params.appId);
    const appSecret = generateAppSecret();

    if (!app) {
      return res.status(200).json({ error: "App not found" });
    }

    const secret = await insertSecret({
      secretKey: appSecret,
      appId: app.id
    });

    logger.info(`New secret created for app ${app.id}`);

    return res.status(201).json(secret);
  } catch (err) {
    if (err instanceof PostgresError) {
      logger.error(err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    logger.error(err);
    res.status(400).json({ error: "Something went wrong" });
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const app = await selectApp(res.locals.user.id, req.params.appId);

    if (!app) {
      return res.status(200).json({ error: "App not found" });
    }

    await deleteSecret(req.params.secretId);

    return res.status(200).json([]);
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

export const secretService = {
  getAll,
  remove,
  create
};
