import type { Request, Response } from "express";
import type { UserParamsDto } from "../schemas/user.schema.js";
import * as userService from "../services/userService.js";

export async function getUsers(_req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json({ data: users });
}

export async function getUserById(req: Request<UserParamsDto>, res: Response) {
  const user = await userService.getUserById(req.params.id);
  res.json({ data: user });
}

export async function getCurrentUser(req: Request, res: Response) {
  const currentUserId = req.user!.userId;
  const user = await userService.getUserById(currentUserId);
  res.json({ data: user });
}

export async function uploadAvatar(req: Request, res: Response) {
  const currentUserId = req.user!.userId;

  const avatarUrl = await userService.uploadAvatar(currentUserId, req.file);

  res.json({
    message: "Avatar updated successfully.",
    avatarUrl: avatarUrl,
  });
}

export async function deleteAvatar(req: Request, res: Response) {
  const currentUserId = req.user!.userId;

  await userService.removeAvatar(currentUserId);

  res.json({
    message: "Avatar deleted successfully.",
  });
}
