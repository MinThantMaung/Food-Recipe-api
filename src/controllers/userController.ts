import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import {
  createOrUpdateUser,
  getAllContinents,
  getCountriesByContinent,
  getCountryById,
  giveReview,
  updateUser,
  updateUserProfile,
} from "../services/userServices";
import {
  getCuisinesList,
  getDietList,
  getMealsList,
  getRecipePagination,
} from "../services/recipesServices";
import { createError } from "../utils/error";
import { errorCode } from "../../config/error";
import { getRecipeById, getUserById } from "../services/authServices";
import { checkUserIfNotExist } from "../utils/auth";
import { uploadProfileImage } from "../services/uploadProfileImage";
import { getOrSetCache } from "../utils/cache";

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

export const getRecipesByPagination = [
  query("cursor")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Cursor must be a positive recipe ID."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be an integer between 1 and 50."),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        return next(createError(errors[0].msg, 400, errorCode.invalid));
      }

      const cursor =
        req.query.cursor === undefined
          ? undefined
          : Number(req.query.cursor);

      const limit =
        req.query.limit === undefined ? 4 : Number(req.query.limit);

      const cacheKey =
        `recipes:cards:cursor:${cursor ?? "start"}:limit:${limit}`;

      const recipes = await getOrSetCache(cacheKey, () =>
        getRecipePagination({
          take: limit + 1,
          skip: cursor === undefined ? 0 : 1,
          cursor: cursor === undefined ? undefined : { id: cursor },
          orderBy: { id: "desc" },
        }),
      );

      const hasNextPage = recipes.length > limit;
      // Avoid mutating the cached result.
      const pageRecipes = recipes.slice(0, limit);

      const nextCursor = hasNextPage
        ? pageRecipes[pageRecipes.length - 1]!.id
        : null;

      return res.status(200).json({
        message: "Recipes fetched successfully",
        hasNextPage,
        nextCursor,
        recipes: pageRecipes,
      });
    } catch (error) {
      return next(error);
    }
  },
];

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
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
          phone: user.phone,
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

export const updatePhone = [
  body("phone")
    .isString()
    .withMessage("Phone number must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .customSanitizer((value: string) => value.replace(/[\s-]/g, ""))
    .matches(/^\+[1-9]\d{7,14}$/)
    .withMessage("Enter a phone number with country code, e.g. +819012345678"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length > 0) {
        return next(createError(errors[0].msg, 400, errorCode.invalid));
      }

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Please sign in to update your phone number.",
        });
      }

      const { phone } = req.body;

      const user = await getUserById(userId);
      checkUserIfNotExist(user);

      const updatedUser = await createOrUpdateUser(userId, phone);

      return res.status(200).json({
        message: "Phone number updated successfully",
        phone: updatedUser.phone,
      });
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        return res.status(409).json({
          message: "This phone number is already in use.",
        });
      }

      next(error);
    }
  },
];

export const updateProfile = [
  body("firstName")
    .isString()
    .withMessage("First name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName")
    .isString()
    .withMessage("Last name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("countryCode")
    .optional() // Keep the current country when omitted.
    .isString()
    .withMessage("Country code must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Country code cannot be empty")
    .bail()
    .toUpperCase(),
  body("image").custom((_value, { req }) => {
    const file = req.file;

    if (!file) return true;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error("Image must be JPEG, PNG, or WebP");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be 5 MB or smaller");
    }

    return true;
  }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({
        onlyFirstError: true,
      });

      if (errors.length > 0) {
        return next(createError(errors[0].msg, 400, errorCode.invalid));
      }
      const userId = Number(req.userId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return next(
          createError("Please sign in to continue", 401, errorCode.invalid),
        );
      }

      const existingUser = await getUserById(userId);
      checkUserIfNotExist(existingUser);

      const { firstName, lastName, countryCode } = req.body;

      let countryId: number | undefined;

      if (countryCode !== undefined) {
        // Ensure this function searches by country code, e.g. "JP".
        const country = await getCountryById(countryCode);

        if (!country) {
          return next(
            createError("Country not found", 400, errorCode.invalid)
          );
        }

        countryId = country.id;
      }

      let image: string | undefined;

      if (req.file) {
        image = await uploadProfileImage(req.file, userId);
      }

      console.log("Received file:", req.file?.originalname);

      const user = await updateUserProfile(userId, {
        firstName,
        lastName,
        ...(countryId !== undefined && { countryId }),
        ...(image !== undefined && { image }),
      });

      return res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  },
];
