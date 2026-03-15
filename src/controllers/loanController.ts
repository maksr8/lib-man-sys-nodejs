import type { Request, Response } from "express";
import type { CreateLoanDto, LoanParamsDto } from "../schemas/loan.schema.js";
import * as loanService from "../services/loanService.js";
import type { UserRole } from "../generated/prisma/enums.js";

export async function getLoans(req: Request, res: Response) {
  const { userId, role } = req.user!;

  const loans = await loanService.getAllLoans(userId, role as UserRole);
  res.json({ data: loans });
}

export async function createLoan(
  req: Request<unknown, unknown, CreateLoanDto>,
  res: Response,
) {
  const currentUserId = req.user!.userId;
  const { bookId } = req.body;

  const loan = await loanService.createLoan(bookId, currentUserId);
  res.status(201).json({ data: loan });
}

export async function returnLoan(req: Request<LoanParamsDto>, res: Response) {
  const { userId, role } = req.user!;
  const loanId = req.params.id;

  const loan = await loanService.returnLoan(loanId, userId, role as UserRole);
  res.json({ data: loan });
}
