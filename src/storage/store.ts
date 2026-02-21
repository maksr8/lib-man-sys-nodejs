import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Store } from "../types/store.js";

const DATA_FILE = join(process.cwd(), "data.json");

export const store: Store = {
  books: [],
  users: [],
  loans: [],
};

export function loadData(): void {
  if (!existsSync(DATA_FILE)) return;

  const raw = readFileSync(DATA_FILE, "utf-8");
  const parsed = JSON.parse(raw);

  store.books = parsed.books || [];
  store.users = parsed.users || [];

  if (Array.isArray(parsed.loans)) {
    for (const rawItem of parsed.loans) {
      store.loans.push({
        id: rawItem.id,
        userId: rawItem.userId,
        bookId: rawItem.bookId,
        status: rawItem.status,
        loanDate: new Date(rawItem.loanDate),
        returnDate: rawItem.returnDate ? new Date(rawItem.returnDate) : null,
      });
    }
  } else {
    store.loans = [];
  }
}

export function saveData(): void {
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}
