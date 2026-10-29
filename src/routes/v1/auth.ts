import express from 'express';
import { authCheck, confirmPassword, countryContinent, deleteAccount, forgetPassword, googleLogin, login, logout, register, resendOtp, resetPassword, resetSettingPassword, verifyOtp, verifyOtpPassword } from '../../controllers/authController';
import { auth } from '../../middlewares/auth';
import { loginLimiter } from '../../middlewares/rateLimiter';
import { sendContactEmail, updatePhone, updateProfile } from '../../controllers/userController';
import { upload } from '../../middlewares/upload';

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
router.patch('/phone',auth,updatePhone)
router.patch('/updatePassword',auth,resetSettingPassword)
router.delete('/user',auth,deleteAccount)
router.post("/contact", sendContactEmail);

router.get("/auth-check", auth, authCheck);
router.patch("/update-user", auth,upload.single("image"), updateProfile)

export default router;