import express from "express";
import * as bookController from "../controllers/bookController.js";
import { jsonParser } from "../middleware/jsonParser.js";
import { validate } from "../middleware/validate.js";
import {
  BookParamsSchema,
  createBookSchema,
  updateBookSchema,
} from "../schemas/book.schema.js";
import { requireRole } from "../middleware/role.js";
import { UserRole } from "../generated/prisma/enums.js";
import { requireAuth } from "../middleware/auth.js";

export const booksRouter = express.Router();

booksRouter.get("/", bookController.getBooks);

booksRouter.get(
  "/:id",
  validate(BookParamsSchema, "params"),
  bookController.getBookById,
);

booksRouter.post(
  "/",
  requireAuth,
  requireRole([UserRole.ADMIN]),
  jsonParser,
  validate(createBookSchema),
  bookController.createBook,
);

booksRouter.put(
  "/:id",
  requireAuth,
  requireRole([UserRole.ADMIN]),
  jsonParser,
  validate(BookParamsSchema, "params"),
  validate(updateBookSchema),
  bookController.updateBook,
);

booksRouter.delete(
  "/:id",
  requireAuth,
  requireRole([UserRole.ADMIN]),
  validate(BookParamsSchema, "params"),
  bookController.deleteBook,
);
