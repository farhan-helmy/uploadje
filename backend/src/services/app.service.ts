import type { Request, Response } from "express";
import {
  deleteApp,
  insertApp,
  selectApp,
  selectApps,
  updateApp,
} from "../repository/app.repository";
import { PostgresError } from "postgres";
import { logger } from "../config/logger";
import { App } from "../types/app.type";
import { generateAppKey, generateAppSecret } from "../utils/secret";
import { generateRandomName } from "../utils/generate-random-name";

const get = async (req: Request, res: Response) => {
  try {
    const app = await selectApp(res.locals.user.id, req.params.appId);

    if (!app) {
      return res.status(200).json({ error: "App not found" });
    }

    return res.status(200).json(app);
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
    const apps = await selectApps(res.locals.user.id);

    if (apps.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(apps);
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
  const app: App = req.body;

  if (!app.name)
    app.name = generateRandomName()

  try {
    app.userId = res.locals.user.id;
    app.appKey = generateAppKey();
    app.appSecret = generateAppSecret();

    const appCreated = await insertApp(app);

    return res.status(201).json(appCreated);
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

const update = async (req: Request, res: Response) => {
  try {
    const app = await selectApp(res.locals.user.id, req.params.appId);

    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }

    if(req.body.name === app.name) {
      return res.status(200).json({ message: "App name is the same, no changes applied" });
    }

    const appUpdated = await updateApp(req.body.name);

    return res.status(200).json(appUpdated[0]);
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
    const app = await selectApp(res.locals.user.id, req.params.appId);

    if (!app) {
      return res.status(404).json({ error: "App not found / already deleted" });
    }

    await deleteApp(req.params.appId);

    return res.status(200).json({ message: "App deleted" });
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

export const appService = {
  get,
  getAll,
  create,
  update,
  remove,
};
