import express from 'express';
import { authCheck, confirmPassword, login, logout, register, resendOtp, verifyOtp } from '../../controllers/authController';
import { auth } from '../../middlewares/auth';
import { loginLimiter } from '../../middlewares/rateLimiter';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/confirm-password', confirmPassword);
router.post('/login',loginLimiter, login);
router.post('/logout', logout);
router.post('/resend-otp', resendOtp); // Assuming you want to resend OTP using the same register route

//google login route
//router.post("/auth/google", googleLogin);

router.get("/auth-check", auth, authCheck);

export default router;