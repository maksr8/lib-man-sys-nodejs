import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS!);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
