import express from 'express';
import { authCheck, confirmPassword, login, logout, register, verifyOtp } from '../../controllers/authController';
import { auth } from '../../middlewares/auth';
import { loginLimiter } from '../../middlewares/rateLimiter';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/confirm-password', confirmPassword);
router.post('/login',loginLimiter, login);
router.post('/logout', logout);

//google login route
//router.post("/auth/google", googleLogin);

router.get("/auth-check", auth, authCheck);

export default router;