import { prismaClient } from "../lib/prisma";

export const getRecipeForCard = async () => {
  const recipes = await prismaClient.recipe.findMany({
    select: {
      id: true,
      title: true,
      image: true,
      slug: true,
      prepTime: true,
      cookingTime: true,
      country: {
        select: {
          name: true,
          cuisineName: true,
        },
      },
    },
  });

  const reviewStats = await prismaClient.review.groupBy({
    by: ["recipeId"],
    where: {
      recipeId: { in: recipes.map((recipe) => recipe.id) },
    },
    _avg: { rating: true },
    _count: { _all: true },
  });

  const statsByRecipe = new Map(
    reviewStats.map((stats) => [stats.recipeId, stats]),
  );

  return recipes.map((recipe) => {
    const stats = statsByRecipe.get(recipe.id);

    return {
      ...recipe,
      rating: stats?._avg.rating ?? 0,
      reviewCount: stats?._count._all ?? 0,
    };
  });
};

export const getRecipeById = async (id: number) => {
  const recipe = await prismaClient.recipe.findUnique({
    where: { id },
    include: {
      country: {
        select: {
          id: true,
          name: true,
          cuisineName: true,
        },
      },
      recipeIngredients: {
        orderBy: { position: "asc" },
        include: {
          ingredient: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      recipeSteps: {
        orderBy: { stepNumber: "asc" }
      },
      recipeCategories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!recipe) {
    return null;
  }

  const reviewCount = recipe.reviews.length;

  const rating =
    reviewCount === 0
      ? 0
      : recipe.reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviewCount;

  return {
    ...recipe,
    rating,
    reviewCount,
  };
};