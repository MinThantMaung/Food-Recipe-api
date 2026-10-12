import { Request, Response, NextFunction } from "express";
import { getAllContinents, getCountriesByContinent } from "../services/userServices";
import { getCuisinesList, getDietList, getMealsList } from "../services/recipesServices";

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

    if (!Number.isInteger(continentId) || continentId <= 0) {
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