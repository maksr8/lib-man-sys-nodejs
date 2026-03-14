import { LoanStatus, Prisma, type Loan } from "../generated/prisma/client.js";
import { prisma } from "../db/prisma.js";
import type { CreateLoanDto } from "../schemas/loan.schema.js";
import { AppError } from "../utils/AppError.js";

export async function getAllLoans(): Promise<Loan[]> {
  return await prisma.loan.findMany();
}

export async function getLoanById(id: string): Promise<Loan | null> {
  return await prisma.loan.findUnique({
    where: { id: id }
  })
}

export async function createLoan(dto: CreateLoanDto): Promise<Loan> {
  const book = await prisma.book.findUnique({
    where: { id: dto.bookId },
    select: { available: true }
  });

  if (!book) throw new AppError(404, "Book not found");
  if (!book.available) throw new AppError(409, "Book is not available");

  const activeLoan = await prisma.loan.findFirst({
    where: {
      bookId: dto.bookId,
      status: LoanStatus.ACTIVE
    },
    select: { id: true }
  });
  if (activeLoan) {
    throw new AppError(409, "Book is already on loan");
  }

  try {
    const loan = await prisma.loan.create({
      data: {
        userId: dto.userId,
        bookId: dto.bookId,
      },
    });

    await prisma.book.update({
      where: { id: dto.bookId },
      data: { available: false },
    });

    return loan;
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new AppError(404, "User not found");
      }
    }
    throw error;
  }
}

export async function returnLoan(id: string): Promise<Loan> {
  const loan = await prisma.loan.findUnique({
    where: { id },
    select: { status: true, bookId: true }
  });

  if (!loan) throw new AppError(404, "Loan not found");

  if (loan.status === LoanStatus.RETURNED) {
    throw new AppError(409, "Loan is already returned");
  }

  const updatedLoan = await prisma.loan.update({
    where: { id },
    data: {
      status: LoanStatus.RETURNED,
      returnDate: new Date(),
    },
  });

  await prisma.book.update({
    where: { id: loan.bookId },
    data: { available: true },
  });

  return updatedLoan;
}
