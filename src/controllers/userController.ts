import type { Request, Response } from "express";
import type { CreateUserDto, UserParamsDto } from "../schemas/user.schema.js";
import * as userService from "../services/userService.js";

export function getUsers(_req: Request, res: Response) {
  res.json({ data: userService.getAllUsers() });
}

export function getUserById(req: Request<UserParamsDto>, res: Response) {
  const user = userService.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ data: user });
}

export async function createUser(
  req: Request<unknown, unknown, CreateUserDto>,
  res: Response
) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ data: user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create user";
    return res.status(400).json({ error: message });
  }
}
