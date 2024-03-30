import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { species, trees } from "./schema";
import { env } from "@/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
const db = drizzle(pool);

const main = async () => {
  console.log("Seed start");
  await db.delete(trees);

  const speciesFile = Bun.file("scripts/data/tidy.json");
  const speciesContents = (await speciesFile.json()) as Array<{ id: string }>;
  const treeFile = Bun.file("scripts/data/converted.json");
  const contents = (await treeFile.json()) as Array<SeedDatum>;

  const allSpecies = speciesContents.map((c) => c.id);
  const uniqueSpecies = Array.from(new Set(contents.map((c) => c.species)));

  // find species that are not in the species file
  const missingSpecies = uniqueSpecies.filter((s) => !allSpecies.includes(s));
  if (missingSpecies.length > 0) {
    console.error(
      `Missing species: ${missingSpecies.join(", ")}. Please run scripts/scrape-data.ts`,
    );
    process.exit(1);
  }
  console.log("Adding species...");
  console.log(
    `Found ${speciesContents.length} records. Splitting into batches...`,
  );
  await db
    .insert(species)
    .values(speciesContents as unknown as typeof species.$inferInsert);

  console.log("Adding trees...");
  console.log(`Found ${contents.length} records. Splitting into batches...`);
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

    await Promise.all(
      batch.map((b) => {
        console.log(`Adding tree ${b.name}...`);
        return db
          .insert(trees)
          .values(b as unknown as typeof trees.$inferInsert);
      }),
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
  name: string;
  category: string;
  quarter: string;
  address: string;
  family: string;
  genus: string;
  species: string;
  year: number | null;
  longitude: number;
  latitude: number;
};
