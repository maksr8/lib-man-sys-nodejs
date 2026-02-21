import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email").toLowerCase(),
});

export const UserParamsSchema = z.object({
  id: z.uuid("Invalid ID format")
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UserParamsDto = z.infer<typeof UserParamsSchema>;
