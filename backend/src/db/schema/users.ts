import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { apps } from './apps';
 
export const users = pgTable('users', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
    email: text('email').unique().notNull(),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
    deletedAt: timestamp('deleted_at'),
});

export const userRelations = relations(users, ({many}) => ({
    apps: many(apps)
}))

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;