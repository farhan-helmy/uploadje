import { Router } from "express";
import { validateJWT } from "../middleware/middleware";
import { meService } from "../services/me.service";

const router = Router();

router
  .get("/", validateJWT, meService.getUser);

export default router;
