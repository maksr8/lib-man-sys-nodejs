import type { JwtPayload } from "jsonwebtoken";

export interface AccessJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ResetPasswordJwtPayload extends JwtPayload {
  email: string;
}
