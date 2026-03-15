import {
  LoanStatus,
  Prisma,
  UserRole,
  type Loan,
} from "../generated/prisma/client.js";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function getAllLoans(
  userId: string,
  role: UserRole,
): Promise<Loan[]> {
  const whereClause = role === UserRole.ADMIN ? {} : { userId };

  return await prisma.loan.findMany({
    where: whereClause,
    include: { book: true },
  });
}

export async function createLoan(
  bookId: string,
  userId: string,
): Promise<Loan> {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { available: true },
  });

  if (!book) throw new AppError(404, "Book not found");
  if (!book.available) throw new AppError(409, "Book is not available");

  const activeLoan = await prisma.loan.findFirst({
    where: {
      bookId: bookId,
      status: LoanStatus.ACTIVE,
    },
    select: { id: true },
  });

  if (activeLoan) {
    throw new AppError(409, "Book is already on loan");
  }

  try {
    const [loan] = await prisma.$transaction([
      prisma.loan.create({
        data: {
          userId: userId,
          bookId: bookId,
        },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { available: false },
      }),
    ]);

    return loan;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new AppError(404, "User or Book not found");
      }
    }
    throw error;
  }
}

export async function returnLoan(
  loanId: string,
  userId: string,
  role: UserRole,
): Promise<Loan> {
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    select: { status: true, bookId: true, userId: true },
  });

  if (!loan) throw new AppError(404, "Loan not found");

  if (role !== UserRole.ADMIN && loan.userId !== userId) {
    throw new AppError(403, "You can only return your own loans");
  }

  if (loan.status === LoanStatus.RETURNED) {
    throw new AppError(409, "Loan is already returned");
  }

  const [updatedLoan] = await prisma.$transaction([
    prisma.loan.update({
      where: { id: loanId },
      data: {
        status: LoanStatus.RETURNED,
        returnDate: new Date(),
      },
    }),
    prisma.book.update({
      where: { id: loan.bookId },
      data: { available: true },
    }),
  ]);

  return updatedLoan;
}
