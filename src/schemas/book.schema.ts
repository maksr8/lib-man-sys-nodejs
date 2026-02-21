import * as z from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z
    .number()
    .int()
    .min(1)
    .refine((y) => y <= new Date().getFullYear() + 1, {
      message: "Year must be at most next year",
    }),
  isbn: z.string().min(1, "ISBN is required"),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  year: z
    .number()
    .int()
    .min(1)
    .refine((y) => y <= new Date().getFullYear() + 1, {
      message: "Year must be at most next year",
    })
    .optional(),
  isbn: z.string().min(1).optional(),
});

export const BookParamsSchema = z.object({
  id: z.uuid("Invalid ID format")
});

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
export type BookParamsDto = z.infer<typeof BookParamsSchema>;