import type { Data } from "./trefle-types";

const colorEnum = {
  yellow: "#FFFF00",
  green: "#008000",
  white: "#FFFFFF",
  brown: "#A52A2A",
  purple: "#800080",
  blue: "#0000FF",
  red: "#FF0000",
};
const monthEnum = {
  jan: "JAN",
  feb: "FEB",
  mar: "MAR",
  apr: "APR",
  may: "MAY",
  jun: "JUN",
  jul: "JUL",
  aug: "AUG",
  sep: "SEP",
  oct: "OCT",
  nov: "NOV",
  dec: "DEC",
};
const habitEnum = {
  Tree: "TREE",
  Shrub: "SHRUB",
  Vine: "VINE",
  "Forb/herb": "HERB",
};
const rateEnum = {
  Slow: "SLOW",
  Rapid: "RAPID",
  Moderate: "MODERATE",
};

const main = async () => {
  const path = "scripts/data/refine.json";
  const file = Bun.file(path);

  const contents = (await file.json()) as Array<[string, Data]>;

  const tidyData = contents
    .map(([tree, data]) => {
      if (!data) {
        return null;
      }
      return {
        id: tree,
        common_name: data.common_name,
        alt_names: data.common_names.en,
        scientific_name: data.scientific_name,
        genus: data.genus,
        family: data.family,
        flower_color:
          data.flower.color?.map(
            (d) => colorEnum[d as keyof typeof colorEnum],
          ) ?? [],
        flower_months:
          data.growth.bloom_months
            ?.map((d) => monthEnum[d as keyof typeof monthEnum])
            .filter(Boolean) ?? [],
        foliage_texture: data.foliage.texture,
        foliage_color:
          data.foliage.color
            ?.map((d) => colorEnum[d as keyof typeof colorEnum])
            .filter(Boolean) ?? [],
        fruit_color:
          data.fruit_or_seed.color
            ?.map((d) => colorEnum[d as keyof typeof colorEnum])
            .filter(Boolean) ?? [],
        fruit_shape: data.fruit_or_seed.shape,
        fruit_months:
          data.growth.fruit_months
            ?.map((d) => monthEnum[d as keyof typeof monthEnum])
            .filter(Boolean) ?? [],
        growth_form: data.specifications.growth_form,
        growth_habit:
          data.specifications.growth_habit
            ?.split(", ")
            .map((d) => habitEnum[d as keyof typeof habitEnum])
            .filter(Boolean) ?? [],
        growth_rate:
          rateEnum[data.specifications.growth_rate as keyof typeof rateEnum],
        growth_months:
          data.growth.growth_months
            ?.map((d) => monthEnum[d as keyof typeof monthEnum])
            .filter(Boolean) ?? [],
        light: data.growth.light,
        humidity: data.growth.atmospheric_humidity,
        soil_ph_min: data.growth.ph_minimum,
        soil_ph_max: data.growth.ph_maximum,
        soil_nutriments: data.growth.soil_nutriments,
        soil_salinity: data.growth.soil_salinity,
        soil_texture: data.growth.soil_texture,
        soil_humidity: data.growth.soil_humidity,
      };
    })
    .filter(Boolean);

// find and remove duplicates by id
  const seen = new Set();
  const uniqueData = tidyData.filter((d) => {
    if (seen.has(d?.id)) {
      return false;
    }
    seen.add(d?.id);
    return true;
  });


  const outputPath = "scripts/data/tidy.json";
  await Bun.write(outputPath, JSON.stringify(uniqueData, null, 2));
};

main()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.error(err);
  });
