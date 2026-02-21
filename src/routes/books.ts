import express from "express";
import * as bookController from "../controllers/bookController.js";
import { jsonParser } from "../middleware/jsonParser.js";
import { validate } from "../middleware/validate.js";
import { BookParamsSchema, createBookSchema, updateBookSchema } from "../schemas/book.schema.js";

export const booksRouter = express.Router();

booksRouter.get("/", bookController.getBooks);
booksRouter.get("/:id", validate(BookParamsSchema, "params"), bookController.getBookById);
booksRouter.post("/", jsonParser, validate(createBookSchema), bookController.createBook);
booksRouter.put("/:id", jsonParser, validate(BookParamsSchema, "params"), validate(updateBookSchema), bookController.updateBook);
booksRouter.delete("/:id", validate(BookParamsSchema, "params"), bookController.deleteBook);
