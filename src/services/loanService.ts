import { randomUUID } from "node:crypto";
import { LOAN_STATUS, type Loan } from "../types/loan.js";
import type { CreateLoanDto } from "../schemas/loan.schema.js";
import { store, saveData } from "../storage/store.js";

export function getAllLoans(): Loan[] {
  return store.loans;
}

export function getLoanById(id: string): Loan | undefined {
  return store.loans.find((l) => l.id === id);
}

export function createLoan(dto: CreateLoanDto): Loan {
  const user = store.users.find((u) => u.id === dto.userId);
  if (!user) throw new Error("User not found");

  const book = store.books.find((b) => b.id === dto.bookId);
  if (!book) throw new Error("Book not found");

  if (!book.available) {
    throw new Error("Book is not available");
  }

  const hasActiveLoan = store.loans.some(
    (l) => l.bookId === dto.bookId && l.status === LOAN_STATUS.ACTIVE
  );
  if (hasActiveLoan) {
    throw new Error("Book is already on loan");
  }

  const loan: Loan = {
    id: randomUUID(),
    userId: dto.userId,
    bookId: dto.bookId,
    loanDate: new Date(),
    returnDate: null,
    status: LOAN_STATUS.ACTIVE,
  };

  store.loans.push(loan);
  book.available = false;

  saveData();
  return loan;
}

export function returnLoan(id: string): Loan | undefined {
  const loan = store.loans.find((l) => l.id === id);
  if (!loan) return undefined;

  if (loan.status === LOAN_STATUS.RETURNED) {
    throw new Error("Loan is already returned");
  }

  loan.status = LOAN_STATUS.RETURNED;
  loan.returnDate = new Date();

  const book = store.books.find((b) => b.id === loan.bookId);
  if (book) {
    book.available = true;
  }

  saveData();
  return loan;
}
