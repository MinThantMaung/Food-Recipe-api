import { prismaClient } from "../lib/prisma";

type ReviewInput = {
  userId: number;
  recipeId: number;
  rating: number;
  comment: string;
};

export const getAllContinents = async () => {
  return prismaClient.continent.findMany({
    select:{
      id: true,
      name: true,
    },
    orderBy: { id: "asc" },
  });
};

export const getCountriesByContinent = async (continentId: number) => {
  return prismaClient.country.findMany({
    where: { continentId },
    select: {
      id: true,
      name: true,
      code: true
    },
    orderBy: { id: "asc" },
  });
};

export const updateUser = async (id: number, userData: any) => {
  return await prismaClient.user.update({
    where: { id },
    data: userData,
  });
};

export const getCountry = async (countryCode: string, continentId: number) => {
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

export const giveReview = async (reviewData: ReviewInput) => {
  const { userId, recipeId, rating, comment } = reviewData;

  return prismaClient.review.upsert({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
    create: {
      userId,
      recipeId,
      rating,
      comment,
    },
    update: {
      rating,
      comment,
    },
  });
};
