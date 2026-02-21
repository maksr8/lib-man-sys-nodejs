import * as z from "zod";

export const createLoanSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  bookId: z.string().min(1, "bookId is required"),
});

export const LoanParamsSchema = z.object({
  id: z.uuid("Invalid ID format")
});

export type CreateLoanDto = z.infer<typeof createLoanSchema>;
export type LoanParamsDto = z.infer<typeof LoanParamsSchema>;