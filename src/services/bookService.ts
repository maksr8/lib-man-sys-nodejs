import { randomUUID } from "node:crypto";
import type { Book } from "../types/book.js";
import type { CreateBookDto, UpdateBookDto } from "../schemas/book.schema.js";
import { saveData, store } from "../storage/store.js";

export function getAllBooks(): Book[] {
  return store.books;
}

export function getBookById(id: string): Book | undefined {
  return store.books.find((b) => b.id === id);
}

export function createBook(dto: CreateBookDto): Book {
  const existing = store.books.find((b) => b.isbn === dto.isbn);
  if (existing) {
    throw new Error("Book with this ISBN already exists");
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
  saveData();
  return book;
}

export function updateBook(id: string, dto: UpdateBookDto): Book | undefined {
  const book = store.books.find((b) => b.id === id);
  if (!book) return undefined;

  if (dto.title !== undefined) book.title = dto.title;
  if (dto.author !== undefined) book.author = dto.author;
  if (dto.year !== undefined) book.year = dto.year;
  if (dto.isbn !== undefined) book.isbn = dto.isbn;
  if (dto.available !== undefined) book.available = dto.available;

  saveData();
  return book;
}

export function deleteBook(id: string): boolean {
  const index = store.books.findIndex((b) => b.id === id);
  if (index === -1) return false;

  store.books.splice(index, 1);
  saveData();
  return true;
}
