import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export function validate<T>(
  schema: ZodType<T>,
  target: "body" | "params" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        error: `Validation error in ${target}`,
        details: result.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    req[target] = result.data;
    next();
  };
}
