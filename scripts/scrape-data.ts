const search = async () => {
  const path = "scripts/data/species.json";
  const file = Bun.file(path);

  const contents = (await file.json()) as Array<{ tree: string }>;

  // batch the content into collection of 100
  const batches = contents.reduce(
    (acc, content, index) => {
      const batchIndex = Math.floor(index / 100);
      if (!acc[batchIndex]) {
        acc[batchIndex] = [];
      }
      (acc[batchIndex] ?? []).push(content);
      return acc;
    },
    [] as Array<Array<{ tree: string }>>,
  );

  const fetchResults = (trees: string[]) =>
    trees.map(async (tree) => {
      console.log(`Fetching ${tree}...`);
      const data = await fetch(
        `https://trefle.io/api/v1/plants/search?token=${process.env.TREFLE_API_KEY}&q=${tree}`,
      );
      if (!data.ok) {
        console.error(data.statusText);
        throw new Error("Failed to fetch data");
      }
      const json = (await data.json()) as Root;
      return [tree, json.data[0]] as const;
    });
  const batchedResults: Array<Array<readonly [string, Daum | undefined]>> = [];

  const queue = async () => {
    const batch = batches.shift();
    if (!batch) {
      return;
    }
    const results = await Promise.all(fetchResults(batch.map((b) => b.tree)));
    batchedResults.push(results);
    await new Promise((resolve) => setTimeout(resolve, 60000));
    await queue();
  };

  await queue();

  const outputPath = "scripts/data/trefle.json";
  await Bun.write(outputPath, JSON.stringify(batchedResults.flat(), null, 2));
};

// search()
//   .then(() => {
//     console.log("done!");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const refine = async () => {
  const path = "scripts/data/trefle.json";
  const file = Bun.file(path);

  const contents = (await file.json()) as Array<[string, Daum]>;

  // batch the content into collection of 100
  const batches = contents.reduce(
    (acc, content, index) => {
      const batchIndex = Math.floor(index / 100);
      if (!acc[batchIndex]) {
        acc[batchIndex] = [];
      }
      (acc[batchIndex] ?? []).push(content);
      return acc;
    },
    [] as Array<Array<[string, Daum]>>,
  );

  const fetchResults = (data: Array<[string, Daum]>) =>
    data.map(async ([tree, datum]) => {
      if (!datum) {
        return [tree, null] as const;
      }
      console.log(`Fetching ${datum.common_name}...`);
      const data = await fetch(
        `https://trefle.io/${datum.links.self}?token=${process.env.TREFLE_API_KEY}`,
      );
      if (!data.ok) {
        console.error(data.statusText);
        throw new Error("Failed to fetch data");
      }
      const json = (await data.json()) as { data: unknown };
      return [tree, json.data] as const;
    });
  const batchedResults: Array<Array<readonly [string, unknown]>> = [];

  const queue = async () => {
    const batch = batches.shift();
    if (!batch) {
      return;
    }
    const results = await Promise.all(fetchResults(batch));
    batchedResults.push(results);
    await new Promise((resolve) => setTimeout(resolve, 60000));
    await queue();
  };

  await queue();

  const outputPath = "scripts/data/refine.json";
  await Bun.write(outputPath, JSON.stringify(batchedResults.flat(), null, 2));
};

refine()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.error(err);
  });

export interface Root {
  data: Daum[];
  links: Links2;
  meta: Meta;
}

export interface Daum {
  author: string;
  bibliography: string;
  common_name: string;
  family: string;
  family_common_name?: string;
  genus: string;
  genus_id: number;
  id: number;
  image_url: string;
  links: Links;
  rank: string;
  scientific_name: string;
  slug: string;
  status: string;
  synonyms: string[];
  year: number;
}

export interface Links {
  genus: string;
  plant: string;
  self: string;
}

export interface Links2 {
  first: string;
  last: string;
  self: string;
}

export interface Meta {
  total: number;
}
