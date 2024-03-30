const categoryMap = {
  Parkbaum: "PARK",
  Strassenbaum: "STREET",
} as const;

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
    const getSpecies = (data: Properties) => {
      if (data.baumartlat == "spec.") return data.baumgattunglat;

      if (data.baumnamelat == "Obstbaum") return "Malus";

      if (data.baumnamelat == "Laubbaum") return "Acer";

      if (!data.baumartlat) return data.baumgattunglat;

      if (data.baumnamelat.includes("Gehölz")) return "Acer";

      if (data.baumnamelat.includes("Salix ")) return "Salix";

      if (data.baumartlat.includes(" '"))
        return data.baumgattunglat + " " + data.baumartlat.split(" '")[0];

      if (data.baumartlat.includes(" ("))
        return data.baumgattunglat + " " + data.baumartlat.split(" (")[0];

      if (data.baumartlat.startsWith("x ")) return data.baumgattunglat;

      return data.baumgattunglat + " " + data.baumartlat;
    };

    const cultivar = feature.properties.baumnamelat.includes(" '")
      ? feature.properties.baumnamelat.split(" '")[1]?.slice(0, -1)
      : null;

    return {
      name: feature.properties.baumnamelat,
      number: feature.properties.baumnummer,
      category:
        categoryMap[feature.properties.kategorie as keyof typeof categoryMap],
      quarter: feature.properties.quartier,
      address: feature.properties.strasse,
      family: feature.properties.baumgattunglat,
      species: getSpecies(feature.properties),
      cultivar: cultivar ?? null,
      year: feature.properties.pflanzjahr
        ? Number(feature.properties.pflanzjahr)
        : null,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
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
