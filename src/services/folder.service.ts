import type { Request, Response } from "express";
import { insertFolder, selectFolder, selectFolders, updateFolder, deleteFolder } from "../repository/folder.repository";

const get = async (req: Request, res: Response) => {
    try {
        const folder = await selectFolder(req.params.folderId, res.locals.app.id);

        if (!folder) {
            return res.status(200).json({ error: "Folder not found" });
        }

        return res.status(200).json(folder);
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const folders = await selectFolders(res.locals.app.id);

        if (folders.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(folders);
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const folder = await insertFolder(req.body);

        return res.status(200).json(folder);
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const folder = await selectFolder(req.params.folderId, req.params.appId);

        if (!folder) {
            return res.status(400).json({ error: "Folder not found" });
        }

        if (folder.name === req.body.name) {
            return res.status(200).json({
                message: "Folder name is the same, no changes applied",
            });
        }

        const folderUpdated = await updateFolder(req.params.folderId, req.body.name);

        return res.status(200).json(folderUpdated[0]);
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const folder = await selectFolder(req.params.folderId, req.params.appId);

        if (!folder) {
            return res.status(200).json({ error: "Folder not found / already deleted" });
        }

        await deleteFolder(req.params.folderId);

        return res.status(200).json({ message: "Folder deleted" });
    } catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
}

export const folderService = { get, getAll, create, update, remove };