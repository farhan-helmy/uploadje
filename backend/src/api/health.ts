import { Router } from "express";
import { logger } from "../config/logger";

const router = Router();

router.get("/", (req, res) => {
  logger.info("Health check");
  res
    .status(200)
    .send("ok");
});

export default router;
