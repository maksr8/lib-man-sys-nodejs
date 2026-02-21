import type { Request, Response } from "express";
import type { CreateUserDto, UserParamsDto } from "../schemas/user.schema.js";
import * as userService from "../services/userService.js";
import { AppError } from "../utils/AppError.js";

export function getUsers(_req: Request, res: Response) {
  res.json({ data: userService.getAllUsers() });
}

export function getUserById(req: Request<UserParamsDto>, res: Response) {
  const user = userService.getUserById(req.params.id);
  if (!user) throw new AppError(404, "User not found");
  res.json({ data: user });
}

export async function createUser(
  req: Request<unknown, unknown, CreateUserDto>,
  res: Response
) {
  const user = await userService.createUser(req.body);
  res.status(201).json({ data: user });
}
