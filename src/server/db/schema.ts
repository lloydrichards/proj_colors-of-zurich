import {
  doublePrecision,
  integer,
  numeric,
  pgEnum,
  pgTableCreator,
  serial,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `colors-of-zurich_${name}`);

export const treeCategoryEnum = pgEnum("category", ["STREET", "PARK"]);
export const monthEnum = pgEnum("month", [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
]);
export const habitEnum = pgEnum("habit", ["TREE", "SHRUB", "VINE", "HERB"]);
export const rateEnum = pgEnum("rate", ["SLOW", "MODERATE", "RAPID"]);

export const trees = pgTable("trees", {
  id: serial("id").primaryKey(),
  name: text("name"),
  number: text("number"),
  category: treeCategoryEnum("category"),
  quarter: text("quarter"),
  address: text("address"),
  family: text("family"),
  species: text("species").references(() => species.id),
  cultivar: text("cultivar"),
  year: integer("year"),
  longitude: numeric("longitude"),
  latitude: numeric("latitude"),
});

export const species = pgTable("species", {
  id: text("id").primaryKey(),
  common_name: text("common_name"),
  alt_names: text("common_names").array(),
  scientific_name: text("scientific_name"),
  genus: text("genus"),
  family: text("family"),
  flower_color: text("flower_color").array(),
  flower_months: monthEnum("bloom_months").array(),
  foliage_texture: text("foliage_texture"),
  foliage_color: text("foliage_color").array(),
  fruit_color: text("fruit_color").array(),
  fruit_shape: text("fruit_shape"),
  fruit_months: monthEnum("fruit_months").array(),
  growth_form: text("growth_form"),
  growth_habit: habitEnum("growth_habit").array(),
  growth_rate: rateEnum("growth_rate"),
  growth_months: monthEnum("growth_months").array(),
  light: integer("light"),
  humidity: integer("humidity"),
  soil_ph_min: doublePrecision("ph_min"),
  soil_ph_max: doublePrecision("ph_max"),
  soil_nutriments: integer("nutriments"),
  soil_salinity: integer("salinity"),
  soil_texture: integer("soil_texture"),
  soil_humidity: integer("soil_humidity"),
});
