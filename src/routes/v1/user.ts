import express from 'express';
import { getContinents, getCountries } from '../../controllers/userController';
import { getRecipeDetail, getRecipesCard } from '../../controllers/recipeController';

const router = express.Router();

router.get('/continents', getContinents);
router.get('/continents/:continentId/countries', getCountries);
router.get('/recipes', getRecipesCard)
router.get("/recipe/:id", getRecipeDetail);


export default router;