import express from "express";
import * as userController from "../controllers/userController.js";
import { jsonParser } from "../middleware/jsonParser.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, UserParamsSchema } from "../schemas/user.schema.js";

export const usersRouter = express.Router();

usersRouter.get("/", userController.getUsers);
usersRouter.get("/:id", validate(UserParamsSchema, "params"), userController.getUserById);
usersRouter.post("/", jsonParser, validate(createUserSchema), userController.createUser);
