import express from "express";
import { booksRouter } from "./books.js";
import { usersRouter } from "./users.js";
import { loansRouter } from "./loans.js";

export const routes = express.Router();

routes.use("/books", booksRouter);
routes.use("/users", usersRouter);
routes.use("/loans", loansRouter);
