import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { images } from "./images";

export const apps = pgTable("apps", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  appKey: text("app_key").unique().notNull(),
  appSecret: text("app_secret").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  userId: text("user_id"),
});

export const appRelations = relations(apps, ({ one, many }) => ({
  user: one(users, {
    fields: [apps.userId],
    references: [users.id],
  }),
  images: many(images)
}));

export type App = typeof apps.$inferSelect
export type NewApp = typeof apps.$inferInsert
