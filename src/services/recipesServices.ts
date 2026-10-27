import { Prisma } from "../../generated/prisma/client";
import { prismaClient } from "../lib/prisma";

type UpdateReviewData = {
  userId: number;
  recipeId: number;
  rating: number;
  comment: string;
};

type RecipeCardOptions = {
  take: number;
  skip: number;
  cursor?: { id: number };
  orderBy: { id: "desc" };
};


export const getRecipePagination = async (options: RecipeCardOptions) => {
  const recipes = await prismaClient.recipe.findMany({
    ...options, // Applies take, skip, cursor, and orderBy
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
      recipeCategories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (recipes.length === 0) return [];

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

export const getRecipesPage = async (
  requestedPage: number,
  limit: number,
) => {
  const totalCount = await prismaClient.recipe.count();
  const totalPages = Math.ceil(totalCount / limit);

  // Keep the requested page within the available range.
  const page = Math.min(
    requestedPage,
    Math.max(1, totalPages),
  );

  const skip = (page - 1) * limit;

  const recipes = await getRecipePagination({
    take: limit,
    skip,
    orderBy: { id: "desc" },
  });

  return {
    recipes,
    totalCount,
    totalPages,
    page,
    limit,
  };
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
        orderBy: { stepNumber: "asc" },
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
              email: true,
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

export const getCuisinesList = async (limit?: number) => {
  return prismaClient.country.findMany({
    where: {
      cuisineName: { not: null },
    },
    select: {
      id: true,
      cuisineName: true,
      description: true,
      image: true,
      continent: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: limit,
    orderBy: {
      cuisineName: "asc",
    },
  });
};

export const getMealsList = async (limit?: number) => {
  return prismaClient.category.findMany({
    where: {
      type: "MEAL",
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: limit,
    orderBy: {
      name: "asc",
    },
  });
};

export const getDietList = async () => {
  return prismaClient.category.findMany({
    where: {
      type: "DIET",
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const deleteReview = async (userId: number, recipeId: number) => {
  return prismaClient.review.delete({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });
};

export const updateReview = async ({
  userId,
  recipeId,
  rating,
  comment,
}: UpdateReviewData) => {
  return prismaClient.review.update({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
    data: {
      rating,
      comment: comment.trim(),
    },
  });
};

export const saveRecipe = async (userId: number, recipeId: number) => {
  return prismaClient.savedRecipe.create({
    data: {
      userId,
      recipeId,
    },
  });
};

export const getSavedRecipeIds = async (userId: number) => {
  const savedRecipes = await prismaClient.savedRecipe.findMany({
    where: { userId },
    select: { recipeId: true },
  });

  return savedRecipes.map((saved) => saved.recipeId);
};

export const deleteRecipe = async (userId: number, recipeId: number) => {
  return prismaClient.savedRecipe.deleteMany({
    where: { userId, recipeId },
  });
};

export const getSavedRecipes = async (userId: number) => {
  const savedRecipes = await prismaClient.savedRecipe.findMany({
    where: { userId },
    include: {
      recipe: {
        include: {
          country: {
            select: {
              cuisineName: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

  return savedRecipes.map((saved) => {
    const { reviews, ...recipe } = saved.recipe;

    const reviewCount = reviews.length;

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const rating = reviewCount > 0 ? totalRating / reviewCount : 0;

    return {
      ...saved,
      recipe: {
        ...recipe,
        rating,
        reviewCount,
      },
    };
  });
};

// test

export const getRecipesList = async (options: any) => {
  return prismaClient.recipe.findMany(options)
}

export const getRecipesCount = (
  where: Prisma.RecipeWhereInput,
) => {
  return prismaClient.recipe.count({ where });
};