import { Router } from "express";
import { validateApp, validateBody } from "../middleware/middleware";
import { s3Strategy } from "../strategy/s3";
import { imageService } from "../services/image.service";

const router = Router();

router
  .post(
    "/",
    validateApp,
    s3Strategy.uploadJeStagingUpload.array("image"),
    imageService.create,
  )
  .get("/", validateApp, imageService.getAll)
  .get("/:imageId", validateApp, imageService.get)
  .delete("/:imageId", validateApp, imageService.remove);

export default router;
