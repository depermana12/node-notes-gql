import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { notes } from "./note";

export const tags = table("tags", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 255 }).unique().notNull(),
});

export const tagRelations = relations(tags, ({ many }) => ({
  notes: many(notes),
}));

export const notesTags = table(
  "notes_tags",
  {
    noteId: t.integer("note_id").notNull(),
    tagId: t.integer("tag_id").notNull(),
  },
  (table) => {
    return {
      pk: t.primaryKey({ columns: [table.noteId, table.tagId] }),
    };
  },
);

export const notesTagsRelations = relations(notesTags, ({ one }) => ({
  note: one(notes, { fields: [notesTags.noteId], references: [notes.id] }),
  tag: one(tags, { fields: [notesTags.tagId], references: [tags.id] }),
}));

export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;

export type InsertNoteTag = typeof notesTags.$inferInsert;
export type SelectNoteTag = typeof notesTags.$inferSelect;
