import { Request, Response, NextFunction } from "express";
import {
  deleteReview,
  getRecipeById,
  getRecipeForCard,
  getSavedRecipeIds,
  saveRecipe,
  updateReview,
} from "../services/recipesServices";
import { body, validationResult } from "express-validator";
import { createError } from "../utils/error";
import { errorCode } from "../../config/error";
import { max, min } from "moment";

interface CustomRequest extends Request {
  userId?: number;
}

export const getRecipesCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const recipes = await getRecipeForCard();

    return res.status(200).json({
      message: "Recipes fetched successfully",
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeDetail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    const recipe = await getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    return res.status(200).json({
      message: "Recipe fetched successfully",
      recipe,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewRecipeDetail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.recipeId);

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in to delete your review",
      });
    }

    if (!Number.isSafeInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    await deleteReview(userId, recipeId);

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import { updateReview as updateReviewService } from "../services/recipesServices";

export const updateReviewRecipeDetail = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5")
    .toInt(),
  body("comment")
    .isString()
    .withMessage("Comment must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .bail()
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({
        onlyFirstError: true,
      });
      if (errors.length > 0) {
        return next(
          createError(errors[0].msg, 400, errorCode.invalid),
        );
      }

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Please sign in to update your review",
        });
      }

      const recipeId = Number(req.params.recipeId);

      if (!Number.isSafeInteger(recipeId) || recipeId <= 0) {
        return res.status(400).json({
          message: "Invalid recipe ID",
        });
      }

      const { rating, comment } = req.body;

      const review = await updateReview({
        userId,
        recipeId,
        rating,
        comment,
      });

      return res.status(200).json({
        message: "Review updated successfully",
        review,
      });
    } catch (error) {
      return next(error);
    }
  },
];

export const saveRecipeData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const recipeId = Number(req.params.recipeId);

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in to save this recipe",
      });
    }

    if (!Number.isSafeInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    await saveRecipe(userId, recipeId);

    return res.status(201).json({
      message: "Recipe saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getSaveRecipeData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in to get saved recipe",
      });
    }

    const savedRecipeIds = await getSavedRecipeIds(userId);

    return res.status(201).json({
      message: "Saved Recipes retrieved successfully",
      savedRecipeIds
    });
  } catch (error) {
    next(error);
  }
};