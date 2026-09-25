import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const countriesByContinent = {
  Asia: [
    ["Japan", "JP"],
    ["Myanmar", "MM"],
    ["Thailand", "TH"],
    ["Singapore", "SG"],
    ["Malaysia", "MY"],
    ["Vietnam", "VN"],
    ["Indonesia", "ID"],
    ["Philippines", "PH"],
    ["South Korea", "KR"],
    ["China", "CN"],
    ["India", "IN"],
    ["Nepal", "NP"],
  ],
  Europe: [
    ["United Kingdom", "GB"],
    ["France", "FR"],
    ["Germany", "DE"],
    ["Italy", "IT"],
    ["Spain", "ES"],
    ["Netherlands", "NL"],
    ["Switzerland", "CH"],
    ["Sweden", "SE"],
  ],
  "North America": [
    ["United States", "US"],
    ["Canada", "CA"],
    ["Mexico", "MX"],
    ["Costa Rica", "CR"],
    ["Cuba", "CU"],
  ],
  "South America": [
    ["Brazil", "BR"],
    ["Argentina", "AR"],
    ["Chile", "CL"],
    ["Colombia", "CO"],
    ["Peru", "PE"],
  ],
  Africa: [
    ["Egypt", "EG"],
    ["Morocco", "MA"],
    ["Kenya", "KE"],
    ["Nigeria", "NG"],
    ["South Africa", "ZA"],
  ],
  Oceania: [
    ["Australia", "AU"],
    ["New Zealand", "NZ"],
    ["Fiji", "FJ"],
    ["Papua New Guinea", "PG"],
  ],
} as const;

async function main() {
  for (const [continentName, countries] of Object.entries(
    countriesByContinent,
  )) {
    const continent = await prisma.continent.upsert({
      where: { name: continentName },
      update: {},
      create: { name: continentName },
    });

    for (const [name, code] of countries) {
      await prisma.country.upsert({
        where: { code },
        update: {
          name,
          continentId: continent.id,
        },
        create: {
          name,
          code,
          continentId: continent.id,
        },
      });
    }
  }

  console.log("Continents and countries seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });