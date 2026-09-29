import express from 'express';
import { getContinents, getCountries } from '../../controllers/userController';

const router = express.Router();

router.get('/contients', getContinents);
router.get('/continents/:continentId/countries', getCountries);


export default router;