import { prisma } from "../db/prisma.js";
import { Prisma, type Book } from "../generated/prisma/client.js";
import type { CreateBookDto, UpdateBookDto } from "../schemas/book.schema.js";
import { AppError } from "../utils/AppError.js";

export async function getAllBooks(): Promise<Book[]> {
  return await prisma.book.findMany();
}

export async function getBookById(id: string): Promise<Book> {
  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) throw new AppError(404, "Book not found");

  return book;
}

export async function createBook(dto: CreateBookDto): Promise<Book> {
  try {
    return await prisma.book.create({
      data: {
        ...dto,
        available: true,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError(409, "Book with this ISBN already exists");
      }
    }
    throw error;
  }
}

export async function updateBook(
  id: string,
  dto: UpdateBookDto,
): Promise<Book> {
  const updateData: Prisma.BookUpdateInput = {};
  if (dto.title !== undefined) updateData.title = dto.title;
  if (dto.author !== undefined) updateData.author = dto.author;
  if (dto.year !== undefined) updateData.year = dto.year;
  if (dto.isbn !== undefined) updateData.isbn = dto.isbn;

  try {
    return await prisma.book.update({
      where: { id },
      data: updateData,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(404, "Book not found");
      }
      if (error.code === "P2002") {
        throw new AppError(409, "Another book with this ISBN already exists");
      }
    }
    throw error;
  }
}

export async function deleteBook(id: string): Promise<void> {
  const hasLoan = await prisma.loan.findFirst({
    where: { bookId: id },
    select: { id: true },
  });

  if (hasLoan) {
    throw new AppError(409, "Cannot delete a book that has a loan history");
  }

  try {
    await prisma.book.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(404, "Book not found");
      }
    }
    throw error;
  }
}
