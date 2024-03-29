import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { trees } from "./schema";
import { env } from "@/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
const db = drizzle(pool);

const categoryMap = {
  Parkbaum: "PARK",
  Strassenbaum: "STREET",
} as const;

const main = async () => {
  console.log("Seed start");
  const path = "scripts/data/converted.json";
  const file = Bun.file(path);
  const contents = (await file.json()) as Array<SeedDatum>;
  console.log(contents.length);

  const batches = contents.reduce(
    (acc, content, index) => {
      const batchIndex = Math.floor(index / 100);
      if (!acc[batchIndex]) {
        acc[batchIndex] = [];
      }
      (acc[batchIndex] ?? []).push(content);
      return acc;
    },
    [] as Array<Array<SeedDatum>>,
  );

  const queue = async () => {
    const batch = batches.shift();
    if (!batch) {
      return;
    }
    await db.insert(trees).values(
      batch.map(
        (datum) =>
          ({
            number: datum.id,
            category: categoryMap[datum.category as keyof typeof categoryMap],
            quarter: datum.quarter,
            address: datum.address,
            family: datum.family,
            genus: datum.genus,
            species: datum.species_id,
            name: datum.species_name,
            year: datum.year,
            longitude: datum.coordinates[0],
            latitude: datum.coordinates[1],
          }) as unknown as typeof trees.$inferInsert,
      ),
    );
    console.log(`added ${batch.length} records. Waiting...`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await queue();
  };

  await queue();

  console.log("Seed done");
  process.exit(0);
};

main()
  .then(() => {
    console.log("Seed done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

type SeedDatum = {
  id: string;
  category: string;
  quarter: string;
  address: string;
  family: string;
  genus: string;
  species_name: string;
  species_id: string;
  year: number | null;
  coordinates: [number, number];
};
