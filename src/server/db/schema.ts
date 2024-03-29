import {
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
export const mysqlTable = pgTableCreator((name) => `colors-of-zurich_${name}`);

export const treeCategoryEnum = pgEnum("category", ["STREET", "PARK"]);

export const trees = mysqlTable("trees", {
  id: serial("id").primaryKey(),
  number: text("number"),
  category: treeCategoryEnum("category"),
  quarter: text("quarter"),
  address: text("address"),
  family: text("family"),
  genus: text("genus"),
  species: text("species"),
  name: text("name"),
  year: integer("year"),
  longitude: numeric("longitute"),
  latitude: numeric("latitude"),
});
