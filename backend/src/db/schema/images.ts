import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { apps } from "./apps";

export const images = pgTable("images", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  path: text("path").unique().notNull(),
  size: numeric("size").notNull(),
  key: text("key").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  appId: text("app_id"),
});

export const imageRelations = relations(images, ({ one }) => ({
  app: one(apps, {
    fields: [images.appId],
    references: [apps.id],
  }),
}));

export type Image = typeof images.$inferSelect
export type NewImage = typeof images.$inferInsert
