import { randomUUID } from "node:crypto";
import type { Book } from "../types/book.js";
import type { CreateBookDto, UpdateBookDto } from "../schemas/book.schema.js";
import { saveData, store } from "../storage/store.js";
import { AppError } from "../utils/AppError.js";

export function getAllBooks(): Book[] {
  return store.books;
}

export function getBookById(id: string): Book | undefined {
  return store.books.find((b) => b.id === id);
}

export async function createBook(dto: CreateBookDto): Promise<Book> {
  const existing = store.books.find((b) => b.isbn === dto.isbn);
  if (existing) {
    throw new AppError(400, "Book with this ISBN already exists");
  }
  const book: Book = {
    id: randomUUID(),
    title: dto.title,
    author: dto.author,
    year: dto.year,
    isbn: dto.isbn,
    available: true,
  };
  store.books.push(book);
  await saveData();
  return book;
}

export async function updateBook(id: string, dto: UpdateBookDto): Promise<Book | undefined> {
  const book = store.books.find((b) => b.id === id);
  if (!book) return undefined;

  if (dto.title !== undefined) book.title = dto.title;
  if (dto.author !== undefined) book.author = dto.author;
  if (dto.year !== undefined) book.year = dto.year;
  if (dto.isbn !== undefined && dto.isbn !== book.isbn) {
    const isIsbnTaken = store.books.some((b) => b.isbn === dto.isbn);
    if (isIsbnTaken) {
      throw new AppError(400, "Another book with this ISBN already exists");
    }
    book.isbn = dto.isbn;
  }

  await saveData();
  return book;
}

export async function deleteBook(id: string): Promise<boolean> {
  const index = store.books.findIndex((b) => b.id === id);
  if (index === -1) return false;
  const hasAnyLoan = store.loans.some((l) => l.bookId === id);
  if (hasAnyLoan) {
    throw new AppError(400, "Cannot delete a book that has a loan record");
  }

  store.books.splice(index, 1);
  await saveData();
  return true;
}
