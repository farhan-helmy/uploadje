import { Router } from "express";
import { authService } from "../services/auth.service";
import { validateBody } from "../middleware/middleware";
import {
  userLoginRequestBodySchema,
  userRequestBodySchema,
} from "../types/user.type";

const router = Router();

router
  .post("/register", validateBody(userRequestBodySchema), authService.register)
  .post("/login", validateBody(userLoginRequestBodySchema), authService.login);

export default router;
