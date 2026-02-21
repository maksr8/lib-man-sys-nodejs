import type { Request, Response } from "express";
import type { CreateLoanDto, LoanParamsDto } from "../schemas/loan.schema.js";
import * as loanService from "../services/loanService.js";
import { AppError } from "../utils/AppError.js";

export function getLoans(_req: Request, res: Response) {
  res.json({ data: loanService.getAllLoans() });
}

export async function createLoan(
  req: Request<unknown, unknown, CreateLoanDto>,
  res: Response
) {
  const loan = await loanService.createLoan(req.body);
  res.status(201).json({ data: loan });
}

export async function returnLoan(req: Request<LoanParamsDto>, res: Response) {
  const loan = await loanService.returnLoan(req.params.id);
  if (!loan) throw new AppError(404, "Loan not found");
  res.json({ data: loan });
}
