import express, { type Router } from "express";
import * as userController from "../controllers/userControllers";
import * as authController from "../../authentication/controllers/authController";

const router: Router = express.Router();

// Middleware to protect all routes after this
router.use(authController.protect as any);

// User-specific routes
router.patch("/updatePassword", authController.updatePassword as any);
router.patch("/updateMe", userController.updateMe as any);
router
	.route("/me")
	.get(userController.getMe as any)
	.post(userController.updateMe as any);
router.delete("/deleteMe", userController.deleteMe as any);

// Admin-restricted routes
router.use(authController.restrictTo("admin") as any);

router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser as any);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

export default router;
