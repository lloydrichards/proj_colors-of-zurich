DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('STREET', 'PARK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "colors-of-zurich_trees" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text,
	"category" "category",
	"quarter" text,
	"address" text,
	"family" text,
	"genus" text,
	"species" text,
	"year" integer,
	"longitute" numeric,
	"latitude" numeric
);
