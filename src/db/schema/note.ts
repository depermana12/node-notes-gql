import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import timestamps from "../utils";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const notes = table("notes", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: t.varchar({ length: 255 }).notNull(),
  content: t.text().notNull(),
  isArchived: t.boolean().default(false).notNull(),
  ownerId: t.integer("user_id").notNull(),
  ...timestamps,
});

export const noteRelations = relations(notes, ({ one }) => ({
  owner: one(users, { fields: [notes.ownerId], references: [users.id] }),
}));

export type InsertNote = typeof notes.$inferInsert;
export type SelectNote = typeof notes.$inferSelect;
