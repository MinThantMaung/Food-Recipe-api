import express from 'express';
import { confirmPassword, register, verifyOtp } from '../../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/confirm-password', confirmPassword);
// router.post('/login', login);
// router.post('/logout', logout);

//google login route
//router.post("/auth/google", googleLogin);

export default router;