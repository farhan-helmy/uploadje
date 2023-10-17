import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { apps } from "./apps";

export const secrets = pgTable("secrets", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  secretKey: text("secret_key").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  appId: text("app_id"),
});

export const secretRelations = relations(secrets, ({ one }) => ({
  app: one(apps, {
    fields: [secrets.appId],
    references: [apps.id],
  }),
}));

export type Secret = typeof secrets.$inferSelect
export type NewSecret = typeof secrets.$inferInsert
