import type { Request, Response } from "express";
import type {
  BookParamsDto,
  CreateBookDto,
  UpdateBookDto,
} from "../schemas/book.schema.js";
import * as bookService from "../services/bookService.js";

export async function getBooks(_req: Request, res: Response) {
  const books = await bookService.getAllBooks();
  res.json({ data: books });
}

export async function getBookById(req: Request<BookParamsDto>, res: Response) {
  const book = await bookService.getBookById(req.params.id);
  res.json({ data: book });
}

export async function createBook(
  req: Request<unknown, unknown, CreateBookDto>,
  res: Response,
) {
  const book = await bookService.createBook(req.body);
  res.status(201).json({ data: book });
}

export async function updateBook(
  req: Request<BookParamsDto, unknown, UpdateBookDto>,
  res: Response,
) {
  const book = await bookService.updateBook(req.params.id, req.body);
  res.json({ data: book });
}

export async function deleteBook(req: Request<BookParamsDto>, res: Response) {
  await bookService.deleteBook(req.params.id);
  res.status(204).end();
}
