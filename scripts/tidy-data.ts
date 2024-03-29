import type { Data } from "./trefle-types";

const main = async () => {
  const path = "scripts/data/refine.json";
  const file = Bun.file(path);

  const contents = (await file.json()) as Array<[string, Data]>;

  const tidyData = contents.map(([tree, data]) => {
    if (!data) {
      return null;
    }
    return {
      key: tree,
      slug: data.slug,
      common_name: data.common_name,
      commone_names: data.common_names.en,
      scientific_name: data.scientific_name,
      genus: data.genus,
      family: data.family,
      is_vegetable: data.vegetable,
      is_edible: data.edible,
      edible_part: data.edible_part ?? [],
      flower: {
        color: data.flower.color,
        conspicuous: data.flower.conspicuous,
      },
      foliage: {
        texture: data.foliage.texture,
        color: data.foliage.color,
        retention: data.foliage.leaf_retention,
      },
      fruit: {
        conspicuous: data.fruit_or_seed.conspicuous,
        color: data.fruit_or_seed.color,
        shape: data.fruit_or_seed.shape,
        persistence: data.fruit_or_seed.seed_persistence,
      },
      growth: {
        form: data.specifications.growth_form,
        habit: data.specifications.growth_habit,
        rate: data.specifications.growth_rate,
      },
      calender: {
        growth: data.growth.growth_months ?? [],
        bloom: data.growth.bloom_months ?? [],
        fruit: data.growth.fruit_months ?? [],
      },
      env: {
        light: data.growth.light,
        humidity: data.growth.atmospheric_humidity,
      },
      soil: {
        ph_min: data.growth.ph_minimum,
        ph_max: data.growth.ph_maximum,
        nutriments: data.growth.soil_nutriments,
        salinity: data.growth.soil_salinity,
        texture: data.growth.soil_texture,
        humidity: data.growth.soil_humidity,
      },
    };
  });

  const outputPath = "scripts/data/tidy.json";
  await Bun.write(outputPath, JSON.stringify(tidyData, null, 2));
};

main()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.error(err);
  });
