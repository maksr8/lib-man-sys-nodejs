import express, { type NextFunction } from "express";
import * as userController from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { UserParamsSchema } from "../schemas/user.schema.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { UserRole } from "../generated/prisma/enums.js";
import { uploadAvatar } from "../middleware/uploadAvatar.js";

export const usersRouter = express.Router();

usersRouter.get(
  "/",
  requireAuth,
  requireRole([UserRole.ADMIN]),
  userController.getUsers,
);

usersRouter.get("/me", requireAuth, userController.getCurrentUser);

usersRouter.post(
  "/me/post-avatar",
  requireAuth,
  uploadAvatar.single("avatar"),
  userController.uploadAvatar,
);

usersRouter.delete("/me/avatar", requireAuth, userController.deleteAvatar);

//MOVE THIS TO THE END
//so you dont get "me" as id for example
usersRouter.get(
  "/:id",
  requireAuth,
  requireRole([UserRole.ADMIN]),
  validate(UserParamsSchema, "params"),
  userController.getUserById,
);
