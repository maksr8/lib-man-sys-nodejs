import type { Request, Response } from "express";
import type {
  LoginDto,
  RegisterDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from "../schemas/auth.schema.js";
import * as authService from "../services/authService.js";

const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS!);
const COOKIE_MAX_AGE = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE,
  sameSite: "strict" as const,
};

export async function register(
  req: Request<unknown, unknown, RegisterDto>,
  res: Response,
) {
  const { accessToken, refreshToken, user } = await authService.register(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(201).json({ data: { accessToken, user } });
}

export async function login(
  req: Request<unknown, unknown, LoginDto>,
  res: Response,
) {
  const { accessToken, refreshToken, user } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ data: { accessToken, user } });
}

export async function refresh(req: Request, res: Response) {
  const oldRefreshToken = req.cookies.refreshToken;

  const { accessToken, refreshToken } =
    await authService.refresh(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({ data: { accessToken } });
}

export async function requestPasswordReset(
  req: Request<unknown, unknown, RequestPasswordResetDto>,
  res: Response,
) {
  await authService.requestPasswordReset(req.body.email);
  res.json({ message: "Message sent successfully" });
}

export async function resetPassword(
  req: Request<unknown, unknown, ResetPasswordDto>,
  res: Response,
) {
  const { newPassword, token } = req.body;
  await authService.resetPassword(newPassword, token);
  res.json({ message: "Password reset successfully" });
}
