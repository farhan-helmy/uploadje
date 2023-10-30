import { Router } from "express";
import { folderService } from "../services/folder.service";
import { validateBody, validateJWT } from "../middleware/middleware";
import { createFolderRequestSchema, updateFolderRequestSchema } from "../types/folder.type";



const router = Router();

router
  .get("/", validateJWT, folderService.getAll)
  .get("/:folderId", validateJWT, folderService.get)
  .post(
    "/",
    validateJWT,
    validateBody(createFolderRequestSchema),
    folderService.create,
  )
  .patch(
    "/:folderId",
    validateJWT,
    validateBody(updateFolderRequestSchema),
    folderService.update,
  )
  .delete("/:appId", validateJWT, folderService.remove);

export default router;
