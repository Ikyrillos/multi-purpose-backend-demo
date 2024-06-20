import express from "express";

import * as authController from "../controllers/authController";

const router = express.Router();
// Authentication routes
router.post("/signup", authController.signup);
router.post("/refresh", authController.generateRefreshToken);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

export default router;
