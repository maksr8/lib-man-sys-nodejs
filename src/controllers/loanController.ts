import type { Request, Response } from "express";
import type { CreateLoanDto, LoanParamsDto } from "../schemas/loan.schema.js";
import * as loanService from "../services/loanService.js";

export async function getLoans(_req: Request, res: Response) {
  const loans = await loanService.getAllLoans();
  res.json({ data: loans });
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
  res.json({ data: loan });
}
