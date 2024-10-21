CREATE TABLE IF NOT EXISTS "notes_tags" (
	"note_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "notes_tags_note_id_tag_id_pk" PRIMARY KEY("note_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
