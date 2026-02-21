import express from "express";
import * as loanController from "../controllers/loanController.js";
import { jsonParser } from "../middleware/jsonParser.js";
import { validate } from "../middleware/validate.js";
import { createLoanSchema, LoanParamsSchema } from "../schemas/loan.schema.js";

export const loansRouter = express.Router();

loansRouter.get("/", loanController.getLoans);
loansRouter.post("/", jsonParser, validate(createLoanSchema), loanController.createLoan);
loansRouter.post("/:id/return", validate(LoanParamsSchema, "params"), loanController.returnLoan);
