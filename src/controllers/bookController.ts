import type { Request, Response } from "express";
import type { BookParamsDto, CreateBookDto, UpdateBookDto } from "../schemas/book.schema.js";
import * as bookService from "../services/bookService.js";
import { AppError } from "../utils/AppError.js";

export function getBooks(_req: Request, res: Response) {
  res.json({ data: bookService.getAllBooks() });
}

export function getBookById(req: Request<BookParamsDto>, res: Response) {
  const book = bookService.getBookById(req.params.id);
  if (!book) throw new AppError(404, "Book not found");
  res.json({ data: book });
}

export async function createBook(
  req: Request<unknown, unknown, CreateBookDto>,
  res: Response
) {
  const book = await bookService.createBook(req.body);
  res.status(201).json({ data: book });
}

export async function updateBook(
  req: Request<BookParamsDto, unknown, UpdateBookDto>,
  res: Response
) {
  const book = await bookService.updateBook(req.params.id, req.body);
  if (!book) throw new AppError(404, "Book not found");
  res.json({ data: book });
}

export async function deleteBook(req: Request<BookParamsDto>, res: Response) {
  const deleted = await bookService.deleteBook(req.params.id);
  if (!deleted) throw new AppError(404, "Book not found");
  res.status(204).end();
}
