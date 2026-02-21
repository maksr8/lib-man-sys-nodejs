export const LOAN_STATUS = {
  ACTIVE: "ACTIVE",
  RETURNED: "RETURNED",
} as const;

export type LoanStatus = typeof LOAN_STATUS[keyof typeof LOAN_STATUS];

export type Loan = {
  id: string;
  userId: string;
  bookId: string;
  loanDate: Date;
  returnDate: Date | null;
  status: LoanStatus;
};
