import type { Data } from "./trefle-types";

const main = async () => {
  const path = "scripts/data/gsz.baumkataster_baumstandorte.json";
  const file = Bun.file(path);

  const contents = (await file.json()) as {
    features: Array<{
      geometry: { coordinates: [number, number] };
      properties: Properties;
    }>;
  };

  const converted = contents.features.map((feature) => {
    const species_id =
      feature.properties.baumartlat == "spec."
        ? feature.properties.baumgattunglat
        : feature.properties.baumartlat?.startsWith("x ")
          ? feature.properties.baumgattunglat
          : `${feature.properties.baumgattunglat} ${feature.properties.baumartlat}`;

    return {
      id: feature.properties.poi_id,
      category: feature.properties.kategorie,
      quarter: feature.properties.quartier,
      address: feature.properties.strasse,
      family: feature.properties.baumgattunglat,
      genus: feature.properties.baumartlat,
      species_name: feature.properties.baumnamelat,
      species_id,
      year: feature.properties.pflanzjahr ? Number(feature.properties.pflanzjahr): null,
      coordinates: feature.geometry.coordinates,
    };
  });

  const outputPath = "scripts/data/converted.json";
  await Bun.write(outputPath, JSON.stringify(converted, null, 2));
};

main()
  .then(() => {
    console.log("done!");
  })
  .catch((err) => {
    console.error(err);
  });

export interface Properties {
  objid: string;
  poi_id: string;
  kategorie: string;
  quartier: string;
  strasse?: string;
  baumgattunglat: string;
  baumartlat?: string;
  baumnamelat: string;
  baumnamedeu: string;
  baumnummer: string;
  status: string;
  baumtyp?: string;
  baumtyptext: string;
  pflanzjahr?: string;
  genauigkeit: string;
  kronendurchmesser: number;
}
