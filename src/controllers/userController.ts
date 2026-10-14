import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import {
  getAllContinents,
  getCountriesByContinent,
  giveReview,
} from "../services/userServices";
import {
  getCuisinesList,
  getDietList,
  getMealsList,
} from "../services/recipesServices";
import { createError } from "../utils/error";
import { errorCode } from "../../config/error";
import { getRecipeById, getUserById } from "../services/authServices";

interface CustomRequest extends Request {
  userId?: number;
}

export const getContinents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const continents = await getAllContinents();

    return res.status(200).json({
      message: "Continents retrieved successfully",
      data: continents,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCountries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawId = req.params.continentId;
    const continentId = Number(rawId);

    if (!Number.isSafeInteger(continentId) || continentId <= 0) {
      return res.status(400).json({
        message: "Invalid continent ID",
      });
    }

    const countries = await getCountriesByContinent(continentId);

    return res.status(200).json({
      message: "Countries retrieved successfully",
      data: countries,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCuisine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cuisines = await getCuisinesList();

    return res.status(200).json({
      message: "Cuisines retrieved successfully",
      data: cuisines,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMeals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const meals = await getMealsList();

    return res.status(200).json({
      message: "Meals retrieved successfully",
      data: meals,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDiets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const diets = await getDietList();

    return res.status(200).json({
      message: "Diets retrieved successfully",
      data: diets,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecipesByMeal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const meals = await getMealsList();

    return res.status(200).json({
      message: "Meals retrieved successfully",
      data: meals,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecipeFilters = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [cuisines, meals, diets] = await Promise.all([
      getCuisinesList(),
      getMealsList(),
      getDietList(),
    ]);

    return res.status(200).json({
      message: "Recipe filters retrieved successfully",
      data: {
        cuisines,
        meals,
        diets,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const postReview = [
  param("recipeId", "Invalid recipe ID").isInt({ min: 1 }),
  body("rating", "Rating must be an integer from 1 to 5").isInt({
    min: 1,
    max: 5,
  }),
  body("comment")
    .isString()
    .withMessage("Comment must be text")
    .bail()
    .trim()
    .notEmpty()
    .isLength({ max: 1000 })
    .withMessage("Comment must be 1000 characters or fewer"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({
        onlyFirstError: true,
      });

      if (errors.length > 0) {
        return next(createError(errors[0].msg, 400, errorCode.invalid));
      }

      const recipeId = Number(req.params.recipeId);

      const { rating, comment } = req.body;
      const userId = req.userId;

      if (!userId) {
        return next(
          createError(
            "You must sign in to write a review.",
            401,
            errorCode.unauthenticated,
          ),
        );
      }

      const recipe = await getRecipeById(recipeId);

      if (!recipe) {
        return next(createError("Recipe Not Found!", 404, errorCode.notfound));
      }

      const user = await getUserById(userId);
      if (!user) {
        return next(
          createError(
            "You must sign in to write a review.",
            401,
            errorCode.unauthenticated,
          ),
        );
      }

      const reviewData = {
        userId,
        recipeId,
        rating,
        comment,
      };

      const createdReview = await giveReview(reviewData);

      return res.status(201).json({
        message: "Review submitted successfully",
        review: createdReview,
      });
    } catch (error) {
      return next(error);
    }
  },
];

export const getUserDetailById = [
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId || !Number.isInteger(userId) || userId < 1) {
        return next(
          createError(
            "You must sign in to view your profile.",
            401,
            errorCode.unauthenticated,
          ),
        );
      }
      const user = await getUserById(userId);

      if (!user) {
        return next(createError("User not found.", 404, errorCode.notfound));
      }
      return res.status(200).json({
        message: "Profile fetched successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
          countryId: user.countryId,
          verifiedAt: user.verifiedAt,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          country: user.country
            ? { id: user.country.id, name: user.country.name }
            : null,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
];
