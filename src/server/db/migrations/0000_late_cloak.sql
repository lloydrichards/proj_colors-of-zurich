DO $$ BEGIN
 CREATE TYPE "habit" AS ENUM('TREE', 'SHRUB', 'VINE', 'HERB');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "month" AS ENUM('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "rate" AS ENUM('SLOW', 'MODERATE', 'RAPID');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('STREET', 'PARK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "colors-of-zurich_species" (
	"id" text PRIMARY KEY NOT NULL,
	"common_name" text,
	"common_names" text[],
	"scientific_name" text,
	"genus" text,
	"family" text,
	"flower_color" text[],
	"bloom_months" month[],
	"foliage_texture" text,
	"foliage_color" text[],
	"fruit_color" text[],
	"fruit_shape" text,
	"fruit_months" month[],
	"growth_form" text,
	"growth_habit" habit[],
	"growth_rate" "rate",
	"growth_months" month[],
	"light" integer,
	"humidity" integer,
	"ph_min" double precision,
	"ph_max" double precision,
	"nutriments" integer,
	"salinity" integer,
	"soil_texture" integer,
	"soil_humidity" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "colors-of-zurich_trees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"number" text,
	"category" "category",
	"quarter" text,
	"address" text,
	"family" text,
	"genus" text,
	"species" text,
	"cultivar" text,
	"year" integer,
	"longitude" numeric,
	"latitude" numeric
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "colors-of-zurich_trees" ADD CONSTRAINT "colors-of-zurich_trees_species_colors-of-zurich_species_id_fk" FOREIGN KEY ("species") REFERENCES "colors-of-zurich_species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
