import type { Book } from "./book.js";
import type { User } from "./user.js";
import type { Loan } from "./loan.js";

export type Store = {
  books: Book[];
  users: User[];
  loans: Loan[]
};