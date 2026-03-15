import express from "express";
import * as loanController from "../controllers/loanController.js";
import { jsonParser } from "../middleware/jsonParser.js";
import { validate } from "../middleware/validate.js";
import { createLoanSchema, LoanParamsSchema } from "../schemas/loan.schema.js";
import { requireAuth } from "../middleware/auth.js";

export const loansRouter = express.Router();

loansRouter.get("/", requireAuth, loanController.getLoans);

loansRouter.post(
  "/",
  requireAuth,
  jsonParser,
  validate(createLoanSchema),
  loanController.createLoan,
);

loansRouter.post(
  "/:id/return",
  requireAuth,
  validate(LoanParamsSchema, "params"),
  loanController.returnLoan,
);
