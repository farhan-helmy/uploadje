import { Router } from "express";
import { userService } from "../services/user.service";
import { validateJWT } from "../middleware/middleware";

const router = Router();

router
  .get("/", validateJWT, userService.getUser);

export default router;
