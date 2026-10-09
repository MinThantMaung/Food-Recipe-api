import { Request, Response, NextFunction } from "express";
import { getRecipeById, getRecipeForCard } from "../services/recipesServices";

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