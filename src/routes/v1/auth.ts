import express from 'express';
import { authCheck, confirmPassword, countryContinent, forgetPassword, googleLogin, login, logout, register, resendOtp, resetPassword, verifyOtp, verifyOtpPassword } from '../../controllers/authController';
import { auth } from '../../middlewares/auth';
import { loginLimiter } from '../../middlewares/rateLimiter';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/confirm-password', confirmPassword);
router.post('/login',loginLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', forgetPassword);
router.post('/verify',verifyOtpPassword);
router.post('/reset-password',resetPassword)
router.post('/resend-otp', resendOtp);
router.post('/update-country', countryContinent);
router.post('/google',loginLimiter,googleLogin)

//google login route
//router.post("/auth/google", googleLogin);

router.get("/auth-check", auth, authCheck);

export default router;