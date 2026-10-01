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

export const updateUser = async (id: number, userData: any) => {
  return await prismaClient.user.update({
    where: { id },
    data: userData,
  });
};

export const getCountry = async (
  countryCode: string,
  continentId: number
) => {
  return prismaClient.country.findFirst({
    where: {
      code: countryCode,
      continentId,
    },
  });
};

export const updateUserCountry = async (userId: number, countryId: number) => {
  return prismaClient.user.update({
    where: { id: userId },
    data: {
      country: {
        connect: { id: countryId },
      },
    },
  });
};
