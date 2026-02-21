import { randomUUID } from "node:crypto";
import type { User } from "../types/user.js";
import type { CreateUserDto } from "../schemas/user.schema.js";
import { saveData, store } from "../storage/store.js";
import { AppError } from "../utils/AppError.js";

export function getAllUsers(): User[] {
  return store.users;
}

export function getUserById(id: string): User | undefined {
  return store.users.find((u) => u.id === id);
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const existingUser = store.users.find((u) => u.email === dto.email);
  if (existingUser) {
    throw new AppError(400, "User with this email already exists");
  }

  const user: User = {
    id: randomUUID(),
    name: dto.name,
    email: dto.email,
  };

  store.users.push(user);
  await saveData();
  return user;
}
