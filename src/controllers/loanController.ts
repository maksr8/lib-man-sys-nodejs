import type { Request, Response } from "express";
import type { CreateLoanDto, LoanParamsDto } from "../schemas/loan.schema.js";
import * as loanService from "../services/loanService.js";

export function getLoans(_req: Request, res: Response) {
  res.json({ data: loanService.getAllLoans() });
}

export async function createLoan(
  req: Request<unknown, unknown, CreateLoanDto>,
  res: Response
) {
  try {
    const loan = await loanService.createLoan(req.body);
    res.status(201).json({ data: loan });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create loan";
    const status = ["Book not found", "User not found"].includes(message) ? 404 : 400;
    return res.status(status).json({ error: message });
  }
}

export async function returnLoan(req: Request<LoanParamsDto>, res: Response) {
  try {
    const loan = await loanService.returnLoan(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json({ data: loan });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to return loan";
    return res.status(400).json({ error: message });
  }
}
