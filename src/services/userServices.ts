import { prismaClient } from "../lib/prisma";

export const getAllContinents = async () => {
  return prismaClient.continent.findMany({
    orderBy: { id: "asc" },
  });
};

export const getCountriesByContinent = async (continentId: number) => {
  return prismaClient.country.findMany({
    where: { continentId },
    orderBy: { id: "asc" },
  });
};