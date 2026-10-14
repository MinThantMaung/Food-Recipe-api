import express from 'express';
import { getContinents, getCountries, getCuisine, getDiets, getMeals, getRecipeFilters, getRecipesByMeal, getUserDetailById, postReview } from '../../controllers/userController';
import { getRecipeDetail, getRecipesCard } from '../../controllers/recipeController';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/continents', getContinents);
router.get('/continents/:continentId/countries', getCountries);
router.get('/cuisines', getCuisine);
router.get('/meals', getMeals);
router.get('/diets', getDiets);
router.get('/recipes', getRecipesCard);
router.get("/recipe/:id", getRecipeDetail);
router.get("/cuisinesByMeal", getRecipesByMeal)
router.get("/recipe-filters", getRecipeFilters);
router.post("/review/:recipeId",auth, postReview);
router.get("/user",auth,getUserDetailById)


export default router;