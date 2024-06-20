import express, { NextFunction, Router } from "express";
import * as authController from "../../authentication/controllers/authController";
import * as postController from "../controllers/postsController";

const router: Router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

export default router;
