import { eq } from "drizzle-orm";
import db from "../db/db";
import { Folder, folders, NewFolder } from "../db/schema/folder";

const selectFolder = (folderId: string, appId: string) => {
    return db.query.folders.findFirst({
        where: ((folder, { eq, and }) =>
            and(eq(folder.id, folderId), eq(folder.appId, appId)))
    });
};

const selectFolders = (appId: string) => {
    return db.query.folders.findMany({
        where: eq(folders.appId, appId),
    })
}

const insertFolder = (folder: NewFolder): Promise<Folder[]> => {
    return db.insert(folders).values(folder).returning();
}

const updateFolder = (folderId: string, folderName: string): Promise<Folder[]> => {
    return db.update(folders).set({
        name: folderName,
    })
        .where(eq(folders.id, folderId))
        .returning();
}

const deleteFolder = (folderId: string) => {
    return db.delete(folders).where(eq(folders.id, folderId));
}

export { insertFolder, selectFolder, updateFolder, selectFolders, deleteFolder };