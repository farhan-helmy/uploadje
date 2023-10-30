import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { apps } from "./apps";

export const folders = pgTable("folders", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    parent_folder_id: text("parent_folder_id"),
    appId: text("app_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
    deletedAt: timestamp("deleted_at"),
});

export const folderRelations = relations(folders, ({ one }) => ({
    app: one(apps, {
        fields: [folders.appId],
        references: [apps.id],
    }),
    folder: one(folders, {
        fields: [folders.parent_folder_id],
        references: [folders.id],
    }),
}));

export type Folder = typeof folders.$inferSelect
export type NewFolder = typeof folders.$inferInsert
