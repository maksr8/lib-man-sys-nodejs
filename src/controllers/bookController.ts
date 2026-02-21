import type { Request, Response } from "express";
import type { BookParamsDto, CreateBookDto, UpdateBookDto } from "../schemas/book.schema.js";
import * as bookService from "../services/bookService.js";

export function getBooks(_req: Request, res: Response) {
  res.json({ data: bookService.getAllBooks() });
}

export function getBookById(req: Request<BookParamsDto>, res: Response) {
  const book = bookService.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json({ data: book });
}

export function createBook(
  req: Request<unknown, unknown, CreateBookDto>,
  res: Response
) {
  try {
    const book = bookService.createBook(req.body);
    res.status(201).json({ data: book });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create book";
    return res.status(400).json({ error: message });
  }
}

export function updateBook(
  req: Request<BookParamsDto, unknown, UpdateBookDto>,
  res: Response
) {
  const book = bookService.updateBook(req.params.id, req.body);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json({ data: book });
}

export function deleteBook(req: Request<BookParamsDto>, res: Response) {
  const deleted = bookService.deleteBook(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.status(204).end();
}
