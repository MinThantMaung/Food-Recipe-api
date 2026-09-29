import express from 'express';
import authRoutes from "./auth";
import userRoutes from "./user"

const router = express.Router();

router.use("/api/v1", authRoutes);
router.use("/api/v1/user", userRoutes);
//router.use("/api/v1/admins", adminRoutes);

export default router;