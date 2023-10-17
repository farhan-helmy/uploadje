import { Router } from "express";
import { secretService } from "../services/secret.service";
import { validateJWT } from "../middleware/middleware";

const router = Router();

router
    .get("/:appId", validateJWT, secretService.getAll)
    .post("/:appId", validateJWT, secretService.create)
    .delete("/:secretId/app/:appId", validateJWT, secretService.remove);

export default router;