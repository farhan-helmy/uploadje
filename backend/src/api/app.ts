import { Router } from "express";
import { appService } from "../services/app.service";
import { validateBody, validateJWT } from "../middleware/middleware";
import {
  createAppRequestBodySchema,
  updateAppRequestBodySchema,
} from "../types/app.type";

const router = Router();

router
  .get("/", validateJWT, appService.getAll)
  .get("/:appId", validateJWT, appService.get)
  .post(
    "/",
    validateJWT,
    validateBody(createAppRequestBodySchema.partial({name: true})),
    appService.create,
  )
  .patch(
    "/:appId",
    validateJWT,
    validateBody(updateAppRequestBodySchema),
    appService.update,
  )
  .delete("/:appId", validateJWT, appService.remove);

export default router;
