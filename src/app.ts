import express, { type Request, type Response } from "express";
import { routes } from "./routes/index.js";

export const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Library Management System API" });
});

app.use("/api", routes);
