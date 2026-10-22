import express from "express";
import {
  getContinents,
  getCountries,
  getCuisine,
  getDiets,
  getMeals,
  getRecipeFilters,
  getRecipesByMeal,
  getRecipesByPagination,
  getUserDetailById,
  postReview,
} from "../../controllers/userController";
import {
  deleteReviewRecipeDetail,
  getRecipeDetail,
  getSavedRecipesData,
  getSaveRecipeData,
  saveRecipeData,
  unSaveRecipe,
  updateReviewRecipeDetail,
} from "../../controllers/recipeController";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/continents", getContinents);
router.get("/continents/:continentId/countries", getCountries);
router.get("/cuisines", getCuisine);
router.get("/meals", getMeals);
router.get("/diets", getDiets);
router.get("/pagination", getRecipesByPagination);
router.get("/recipe/:id", getRecipeDetail);
router.get("/cuisinesByMeal", getRecipesByMeal);
router.get("/recipe-filters", getRecipeFilters);
router.post("/review/:recipeId", auth, postReview);
router.get("/user", auth, getUserDetailById);
router.delete("/recipe/:recipeId/review", auth, deleteReviewRecipeDetail);
router.patch("/recipe/:recipeId/review", auth, updateReviewRecipeDetail);
router.post("/recipe/:recipeId/save",auth,saveRecipeData)
router.get("/get/save",auth,getSaveRecipeData)
router.delete("/recipe/:recipeId/unsave",auth,unSaveRecipe)
router.get("/recipes/save",auth,getSavedRecipesData)

export default router;
