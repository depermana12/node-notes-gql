import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import timestamps from "../utils";
import { relations } from "drizzle-orm";
import { notes } from "./note";

export const users = table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  username: t.varchar({ length: 255 }).unique().notNull(),
  email: t.varchar({ length: 255 }).unique().notNull(),
  password: t.text().notNull(),
  verified: t.boolean().default(false).notNull(),
  ...timestamps,
});

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
