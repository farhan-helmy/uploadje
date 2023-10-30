import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { folders } from "./folder";

export const images = pgTable("images", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  path: text("path").unique().notNull(),
  size: numeric("size").notNull(),
  key: text("key").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  folderId: text("folder_id"),
});

export const imageRelations = relations(images, ({ one }) => ({
  folder: one(folders, {
    fields: [images.folderId],
    references: [folders.id],
  }),
}));

export type Image = typeof images.$inferSelect
export type NewImage = typeof images.$inferInsert
