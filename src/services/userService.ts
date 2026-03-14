import { Prisma, type User } from "../generated/prisma/client.js";
import type { CreateUserDto } from "../schemas/user.schema.js";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../db/prisma.js";

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) throw new AppError(404, "User not found");
  return user;
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        ...dto
      }
    });
    return user;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError(409, "User with this email already exists");
      }
    }
    throw error;
  }
}
