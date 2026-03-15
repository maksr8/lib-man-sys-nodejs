import express from "express";
import { booksRouter } from "./books.js";
import { usersRouter } from "./users.js";
import { loansRouter } from "./loans.js";
import { authRouter } from "./auth.js";

export const routes = express.Router();

routes.use("/books", booksRouter);
routes.use("/users", usersRouter);
routes.use("/loans", loansRouter);
routes.use("/auth", authRouter);
